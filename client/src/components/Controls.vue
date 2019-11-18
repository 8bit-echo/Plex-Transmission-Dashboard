<template>
  <div
    class="controls"
    @click.self="deselectTorrents()"
  >
    <div class="buttons">
      <button @click="toggleVPN()">Toggle VPN</button>
      <button
        @click="getTVFolder()"
        :disabled="disabled"
      >
        Move to TV Shows
        <img
          src="@/assets/plextv-icon.svg"
          width="25"
        />
      </button>
      <button
        @click="moveMovie()"
        :disabled="disabled"
      >
        Move to Movies
        <img
          src="@/assets/plextv-icon.svg"
          width="25"
        />
      </button>
      <button
        v-if="selectedTorrent"
        @click="handleStartStop()"
        :disabled="disabled"
      >
        {{ playPauseText }}
      </button>

      <button
        v-if="selectedTorrent"
        @click="removeFromList(selectedTorrent)"
        :disabled="disabled"
        class="danger"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script>
  import { get, post, _delete } from '@/functions';
  import { mapActions, mapMutations, mapState } from 'vuex';
  import { txStatus } from '@/functions';
  import AppError from '@/AppError';

  export default {
    computed: {
      ...mapState(['selectedTorrent', 'isLoading', 'vpnActive']),

      disabled() {
        return !this.selectedTorrent || this.isLoading;
      },

      playPauseText() {
        if (
          this.selectedTorrent.status === txStatus.DOWNLOAD ||
          this.selectedTorrent.status === txStatus.SEED
        ) {
          return 'Stop';
        } else {
          return 'Start';
        }
      }
    },

    methods: {
      ...mapActions(['getVPNStatus', 'getTorrents']),
      ...mapMutations([
        'TORRENT_SELECTED',
        'OPEN_MODAL',
        'LOADING_INDICATOR',
        'DISPLAY_NOTIFICATION'
      ]),

      async toggleVPN() {
        this.LOADING_INDICATOR(true);
        const vpn = await post('/vpn', { toggle: !this.vpnActive });

        if (vpn.success) {
          this.getVPNStatus();
        } else {
          new AppError('failed to toggle VPN');
        }
        this.LOADING_INDICATOR(false);
      },

      /**
       * Deselect a torrent by tapping in dead space
       */
      deselectTorrents() {
        this.TORRENT_SELECTED(null);
      },

      /**
       * gets the closest guess it can to matching a TV show folder against the name of the selected torrent
       **/
      async getTVFolder() {
        this.LOADING_INDICATOR(true);

        try {
          // take a guess at the show this torrent belongs to.
          const { show, season, error } = await post('/guess-tv-show', {
            torrentName: this.selectedTorrent.name
          });

          if (error) {
            this.createNewTVShow();
          } else {
            // confirm the show name and the appropriate season returned by the server.
            this.OPEN_MODAL({
              msg: `Move to ${show} - ${season} folder?`,
              show,
              season,
              action: () => {
                this.moveTVShow(this.selectedTorrent, show, season);
              }
            });
          }
          this.LOADING_INDICATOR(false);
        } catch (error) {
          this.LOADING_INDICATOR(false);
          new AppError(error);
          this.deselectTorrents();
        }
      },

      async createNewTVShow() {
        let show;
        try {
          // show doesn't exist probably. Create new name for the directroy.
          this.OPEN_MODAL({
            msg: 'Could not match to existing show. Enter name of show.',
            action: async show => {
              // create a new directory for the given name entered.
              const { season } = await post('/new-show', {
                show,
                torrent: this.selectedTorrent.name
              });

              this.OPEN_MODAL({
                msg: `Move to ${show} - ${season} folder?`,
                show,
                season,
                action: () => {
                  this.moveTVShow(this.selectedTorrent, show, season);
                }
              });
            },
            extra: {
              isPrompt: true
            }
          });
        } catch (error) {
          new AppError('Failed to create directory for this show.');
        }
      },

      /**
       *  Moves the selected file to the Movies Library in Plex.
       */
      async moveMovie() {
        this.LOADING_INDICATOR(true);
        try {
          const { success } = await post('/move-movie', this.selectedTorrent);
          this.LOADING_INDICATOR(false);
          this.DISPLAY_NOTIFICATION({
            display: true,
            level: 'okay',
            message: 'Successfully moved movie to Plex.'
          });
          if (success) this.removeFromList(this.selectedTorrent);
        } catch (error) {
          this.LOADING_INDICATOR(false);
          new AppError(error);
        }
      },

      /**
       * Moves the TV Show file/folder to the TV Shows library in Plex.
       */
      async moveTVShow(torrent, show, season) {
        this.LOADING_INDICATOR(true);
        post('/move-tv-show', { torrent, show, season })
          .then(response => {
            this.LOADING_INDICATOR(false);
            if (response.success) {
              this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'Successfully moved show to Plex.'
              });
              this.removeFromList(this.selectedTorrent);
            }
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            new AppError(error);
          });
      },

      /**
       * Removes a torrent from the queue / list. leaves file in place.
       */
      async removeFromList(torrent) {
        this.LOADING_INDICATOR(true);
        try {
          const response = await _delete('/torrents', { id: torrent.id });
          if (response.success) {
            this.deselectTorrents();
            this.getTorrents();
          } else {
            new AppError(response.error);
          }
          this.LOADING_INDICATOR(false);
        } catch (error) {
          this.LOADING_INDICATOR(false);
          new AppError(error);
        }
      },

      /**
       * Pause / Resume download of a torrent file.
       */
      handleStartStop() {
        this.LOADING_INDICATOR(true);
        post('/pause', {
          id: this.selectedTorrent.id,
          action: this.playPauseText.toLowerCase()
        })
          .then(() => {
            this.LOADING_INDICATOR(false);
            this.getTorrents();
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            new AppError(error);
          });
      }
    },

  };
</script>

<style lang="scss">
  .controls {
    background: rgb(45, 45, 56);
    color: white;

    button,
    input[type='button'] {
      width: 90%;
      font-family: 'Avenir', sans-serif;
      display: block;
      background-color: #3b3b48;
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

      .buttons {
        display: flex;
        height: 90px;
        overflow-x: scroll;
        overflow-y: hidden;
      }

      button {
        display: flex;
        flex: 1 0 155px;
        margin: 0.5rem 1rem;
      }
    }
  }
</style>
