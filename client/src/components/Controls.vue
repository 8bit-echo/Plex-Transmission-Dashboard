<template>
  <div
    class="controls"
    @click.self="deselectTorrents()"
  >
    <div class="buttons">
      <button
        v-if="false"
        @click="toggleVPN()"
      >Toggle VPN</button>
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

  export default {
    computed: {
      ...mapState(['selectedTorrent', 'isLoading']),

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

      toggleVPN() {
        // not currently working on back-end
        // let action;
        // if (this.vpnStatus) {
        //   action = 'stop';
        // } else {
        //   action = 'start';
        // }

        // post('/vpn', { action }).then(response => {
        //   if (response.success) {
        //     // console.log(`vpn start: success`);
        //     get('/vpn-status').then(result => {
        //       this.vpnStatus = result.status;
        //     });
        //   }
        // });
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
      getTVFolder() {
        this.LOADING_INDICATOR(true);
        post('/guess-tv-show', { torrentName: this.selectedTorrent.name })
          .then(response => {
            const { show, season, error } = response;
            const msg = `Move to ${show} - ${season} folder?`;

            if (error) {
              // show doesn't exist probably. Create new name for the directroy.
              const newShow = prompt(
                `Couldn't find an existing match. Enter the name of the show.`
              );

              post('/new-show', {
                show: newShow,
                torrent: this.selectedTorrent.name
              }).then(response => {
                const newSeason = response.season;
                console.log(newShow, newSeason, this.selectedTorrent);
                this.OPEN_MODAL({
                  msg: `Move to ${newShow} - ${newSeason} folder?`,
                  show: newShow,
                  season: newSeason,
                  action: () => {
                    this.moveTVShow(this.selectedTorrent, newShow, newSeason);
                    this.deselectTorrents();
                  }
                });
              });
            } else {
              this.OPEN_MODAL({
                msg,
                show,
                season,
                action: () => {
                  this.moveTVShow(this.selectedTorrent, show, season);
                  this.deselectTorrents();
                }
              });
            }
            this.LOADING_INDICATOR(false);
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            console.log(error);
            this.deselectTorrents();
          });
      },

      /**
       *  Moves the selected file to the Movies Library in Plex.
       */
      moveMovie() {
        this.LOADING_INDICATOR(true);
        post('/move-movie', this.selectedTorrent)
          .then(response => {
            this.LOADING_INDICATOR(false);
            if (response.success) {
              this.removeFromList(this.selectedTorrent);
            }
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            console.log(error);
          });
      },

      /**
       * Moves the TV Show file/folder to the TV Shows library in Plex.
       */
      moveTVShow(torrent, show, season) {
        this.LOADING_INDICATOR(true);
        post('/move-tv-show', { torrent, show, season })
          .then(response => {
            this.LOADING_INDICATOR(false);
            if (response.success) {
              this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'moved file successfully'
              });
              this.removeFromList(this.selectedTorrent);
            }
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            console.log(error);
          });
      },

      /**
       * Removes a torrent from the queue / list. leaves file in place.
       */
      removeFromList(torrent) {
        this.LOADING_INDICATOR(true);
        _delete('/torrents', { id: torrent.id })
          .then(() => {
            this.LOADING_INDICATOR(false);
            this.getTorrents();
          })
          .catch(error => {
            this.LOADING_INDICATOR(false);
            console.log(error);
          });
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
            console.log(error);
          });
      }
    }
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
