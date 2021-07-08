<template>
  <div class="controls" @click.self="deselectTorrents()">
    <div class="buttons">
      <button @click="toggleVPN()">Toggle VPN</button>
      <button @click="getTVFolder()" :disabled="!!disableMove">
        Move to TV Shows
        <img src="../assets/plextv-icon.svg" width="25" />
      </button>

      <button @click="moveMovie()" :disabled="!!disableMove">
        Move to Movies
        <img src="../assets/plextv-icon.svg" width="25" />
      </button>
      <button
        v-if="selectedTorrent"
        @click="handleStartStop()"
        :disabled="disabled"
      >
        {{ playPauseText }}
      </button>

      <template v-if="selectedTorrent">
        <button
          @click="removeFromList(selectedTorrent)"
          :disabled="disabled"
          class="danger"
        >
          Remove from Queue
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import { post, _delete, txStatus } from '../functions';
  import { useStore } from 'vuex';
  import AppError from '../AppError';
  import { computed, defineComponent } from 'vue';
  import { key } from '../store';
  import { Mutations } from '../constants';
  import { useTorrents } from '../composables/useTorrents';
  import { useVPN } from '../composables/useVPN';
  import { useModal } from '../composables/useModal';
  import { useNotifications } from '../composables/useNotifications';
  import { TorrentDashboard } from '../@types';

  export default defineComponent({
    setup() {
      const store = useStore(key);
      const { selectedTorrent, deselectTorrents, getTorrents } = useTorrents();
      const { vpnActive, toggleVPN } = useVPN();
      const { openModal } = useModal();
      const { displayNotification } = useNotifications();

      const isLoading = computed(() => store.state.isLoading);

      const disabled = computed(() => !selectedTorrent?.value || isLoading.value);
      const disableMove = computed(
        () => disabled.value || selectedTorrent?.value?.percentDone !== 1
      );

      const playPauseText = computed(() =>
        selectedTorrent?.value?.status === txStatus.DOWNLOAD ||
        selectedTorrent?.value?.status === txStatus.SEED
          ? 'Pause'
          : 'Start'
      );

      /**
       * Pause / Resume download of a torrent file.
       */
      const handleStartStop = async () => {
        if (!selectedTorrent.value) return;
        store.commit(Mutations.loadingIndicator, true);
        try {
          await post('/pause', {
            id: selectedTorrent?.value.id,
            action: playPauseText.value.toLowerCase(),
          });
          store.commit(Mutations.loadingIndicator, false);
          getTorrents();
        } catch (error) {
          store.commit(Mutations.loadingIndicator, false);
          new AppError(error);
        }
      };

      /**
       * gets the closest guess it can to matching a TV show folder against the name of the selected torrent
       **/
      const getTVFolder = async () => {
        if (disableMove.value || !selectedTorrent.value) return;
        store.commit(Mutations.loadingIndicator, true);

        try {
          // take a guess at the show this torrent belongs to.
          const { show, season, error } = await post('/guess-tv-show', {
            torrentName: selectedTorrent?.value.name,
          });

          if (error) {
            createNewTVShow();
          } else {
            // confirm the show name and the appropriate season returned by the server.
            openModal({
              msg: `Move to ${show} - ${season} folder?`,
              show,
              season,
              action: () => {
                if (selectedTorrent.value) {
                  moveTVShow(selectedTorrent.value, show, season);
                }
              },
            });
          }
          store.commit(Mutations.loadingIndicator, false);
        } catch (error) {
          store.commit(Mutations.loadingIndicator, false);
          new AppError(error);
          deselectTorrents();
        }
      };

      const createNewTVShow = async () => {
        if (!selectedTorrent.value) return;
        try {
          openModal({
            msg: 'Could not match to existing show. Enter name of show.',
            action: async (show: string) => {
              if (selectedTorrent.value) {
                // create a new directory for the given name entered.
                const { season } = await post('/new-show', {
                  show,
                  torrent: selectedTorrent.value.name,
                });

                openModal({
                  msg: `Move to ${show} - ${season} folder?`,
                  show,
                  season,
                  action: () => {
                    if (selectedTorrent.value) {
                      moveTVShow(selectedTorrent.value, show, season);
                    }
                  },
                });
              }
            },
            extra: {
              isPrompt: true,
            },
          });
        } catch (error) {
          new AppError('Failed to create directory for this show.');
        }
      };

      /**
       * Moves the TV Show file/folder to the TV Shows library in Plex.
       */
      const moveTVShow = async (
        torrent: TorrentDashboard.Torrent,
        show: string,
        season: string
      ) => {
        if (!torrent) return;
        store.commit(Mutations.loadingIndicator, true);
        try {
          const response = await post('/move-tv-show', { torrent: torrent.name, show, season });

          store.commit(Mutations.loadingIndicator, false);
          if (response.success) {
            displayNotification({
              display: true,
              level: 'okay',
              message: 'Successfully moved show to Plex.',
            });

            removeFromList(selectedTorrent?.value);
          }
        } catch (error) {
          store.commit(Mutations.loadingIndicator, false);
          new AppError(error);
        }
      };

      /**
       *  Moves the selected file to the Movies Library in Plex.
       */
      const moveMovie = async () => {
        if (disableMove.value || !selectedTorrent.value) return;
        store.commit(Mutations.loadingIndicator, true);
        try {
          const { success } = await post('/move-movie', selectedTorrent?.value);
          store.commit(Mutations.loadingIndicator, false);
          if (success) {
            removeFromList(selectedTorrent?.value);
            displayNotification({
              display: true,
              level: 'okay',
              message: 'Successfully moved movie to Plex.',
            });
          }
        } catch (error) {
          store.commit(Mutations.loadingIndicator, false);
          new AppError(error);
        }
      };

      /**
       * Removes a torrent from the queue / list. leaves file in place.
       */
      const removeFromList = async (torrent?: TorrentDashboard.Torrent) => {
        if (!torrent) return;
        store.commit(Mutations.loadingIndicator, true);
        try {
          const response = await _delete('/torrents', { id: torrent.id });
          if (response.success) {
            deselectTorrents();
            getTorrents();
          } else {
            new AppError(response.error);
          }
          store.commit(Mutations.loadingIndicator, false);
        } catch (error) {
          store.commit(Mutations.loadingIndicator, false);
          new AppError(error);
        }
      };

      return {
        isLoading,
        vpnActive,
        disabled,
        disableMove,
        selectedTorrent,
        playPauseText,
        deselectTorrents,
        toggleVPN,
        handleStartStop,
        getTVFolder,
        createNewTVShow,
        moveTVShow,
        moveMovie,
        removeFromList,
      };
    },
  });
</script>

<style lang="scss">
  .controls {
    background: rgba(0, 0, 0, 0.15);
    color: white;
    height: calc(97vh - 120px);
    border-radius: 4px;
    margin-left: 10px;

    button,
    input[type='button'] {
      width: 90%;
      font-family: 'Avenir', sans-serif;
      display: block;
      background-color: rgba(0, 0, 0, 0.3);
      color: white;
      border-radius: 5px;
      font-size: 1rem;
      padding: 1rem;
      margin: 1rem auto;
      border: none;
      outline: none;
      box-shadow: 0 0 8px rgba(16, 10, 39, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &:active {
        background-color: #408fcf;
      }

      &.danger {
        background-color: #753535;
      }

      &[disabled] {
        opacity: 0.5;

        &:active {
          background-color: #3b3b48;
        }
      }
    }

    .status-bar {
      background: rgb(32, 32, 39);
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .indicator {
        display: flex;
        align-items: center;
        background: rgb(32, 32, 39);
        padding: 5px;
        color: lightgrey;
      }
      .statusLight {
        width: 0.75rem;
        height: 0.75rem;
        border: solid 1px lightgrey;
        border-radius: 50%;
        display: inline-block;
        margin: 0 10px;
        background-color: #c76172;

        &.active {
          background-color: #2bca2b;
        }
      }
    }

    @media screen and (max-width: 415px) {
      width: 100vw;
      height: 100px;
      overflow: hidden;
      margin: 0;

      .buttons {
        display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
        padding-bottom: 30px;
      }

      button {
        display: flex;
        flex: 1 0 155px;
        margin: 0.5rem 1rem;
      }
    }
  }
</style>
