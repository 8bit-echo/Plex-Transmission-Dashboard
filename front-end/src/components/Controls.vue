<template>
  <div class="controls" @click.self="deselectTorrents()">
    <div class="status-bar">
      <div class="vpnStatus indicator">
        VPN
        <div
          :class="{ statusLight: true, active: vpnStatus === 'ACTIVE' }"
        ></div>
      </div>
      <div class="loading-indicator indicator" v-if="isLoading">
        <img src="../assets/spinner.svg" width="25" />
      </div>
    </div>
    <button @click="toggleVPN()">Toggle VPN</button>
    <button @click="getTVFolder()" :disabled="disabled">
      Move to TV Shows
      <img src="../assets/plextv-icon.svg" width="25" />
    </button>
    <button @click="moveMovie()" :disabled="disabled">
      Move to Movies
      <img src="../assets/plextv-icon.svg" width="25" />
    </button>
    <button
      v-if="selectedTorrent.id"
      @click="handleStartStop()"
      :disabled="disabled"
    >
      {{ playPauseText }}
    </button>

    <button
      v-if="selectedTorrent.id"
      @click="removeFromList(selectedTorrent)"
      :disabled="disabled"
      class="danger"
    >
      Remove
    </button>
  </div>
</template>

<script>
import { get, post, _delete } from '../functions';
import { AppState } from '../AppState';
import { txStatus } from '../functions';

export default {
  props: ['selectedTorrent'],

  data() {
    return {
      vpnStatus: '-',
      playPauseText: 'Start',
      isLoading: false
    };
  },

  computed: {
    disabled() {
      return !this.selectedTorrent.id || this.isLoading;
    }
  },

  methods: {
    toggleVPN() {
      let action;
      if (this.vpnStatus == 'ACTIVE') {
        action = 'stop';
      } else {
        action = 'start';
      }

      post('/vpn', { action }).then(response => {
        if (response.success) {
          console.log(`vpn start: success`);
          get('/vpn-status').then(result => {
            this.vpnStatus = result.status;
          });
        }
      });
    },

    deselectTorrents() {
      AppState.$emit('torrentSelect', { id: null });
    },

    openModal() {
      AppState.$emit('openModal', { msg: 'Start torrent' });
    },

    getTVFolder() {
      // const self = this;
      post('/guess-tv-show', { torrentName: this.selectedTorrent.name }).then(
        response => {
          console.log('response from /guess-tv-show', response);
          const { show, season, error } = response;
          const msg = `Move to ${show} - ${season} folder?`;

          console.log(msg);
          if (error) {
            // handle error ?
          }

          AppState.$emit('openModal', {
            msg,
            show,
            season,
            handleConfirm: () => {
              this.moveTVShow(this.selectedTorrent, show, season);
            }
          });
        }
      );
    },

    moveMovie() {
      this.isLoading = true;
      post('/move-movie', this.selectedTorrent).then(response => {
        console.log(response);

        if (response.success) {
          this.removeFromList(this.selectedTorrent);
        }
      });
    },

    moveTVShow(torrent, show, season) {
      this.isLoading = true;
      console.log('Controls will move TV Show');
      console.log(torrent, show, season);
      post('/move-tv-show', { torrent, show, season }).then(response => {
        if (response.success) {
          this.removeFromList(this.selectedTorrent);
        }
      });
    },

    removeFromList(torrent) {
      this.isLoading = true;
      _delete('/torrents', { id: torrent.id }).then(response => {
        console.log('removing torrents from list.');
        console.log(response);

        AppState.$emit('torrentListShouldChange');
        this.isLoading = false;
      });
    },

    handleStartStop() {
      post('/pause', {
        id: this.selectedTorrent.id,
        action: this.playPauseText.toLowerCase()
      }).then(response => {
        console.log(`start/stop response`, response);
        AppState.$emit('torrentListShouldChange');
      });
    }
  },

  watch: {
    selectedTorrent: {
      deep: true,
      handler(newVal) {
        if (
          newVal.status === txStatus.DOWNLOAD ||
          newVal.status === txStatus.SEED
        ) {
          this.playPauseText = 'Stop';
        } else {
          this.playPauseText = 'Start';
        }
      }
    }
  },

  created() {
    get('/vpn-status').then(result => {
      this.vpnStatus = result.status;
    });

    setInterval(() => {
      get('/vpn-status').then(result => {
        this.vpnStatus = result.status;
      });
    }, 60000);
  }
};
</script>

<style lang="scss">
.controls {
  background: rgb(45, 45, 56);
  color: white;

  button {
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
}
</style>
