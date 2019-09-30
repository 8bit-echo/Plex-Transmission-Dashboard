<template>
  <div class="controls">
    <div class="status-bar">
      <div class="vpnStatus indicator">
        VPN
        <div
          :class="{ statusLight: true, active: vpnStatus === 'ACTIVE' }"
        ></div>
      </div>
    </div>
    <button @click="toggleVPN()">Toggle VPN</button>
    <button>
      Move to TV Shows
      <img src="../assets/plextv-icon.svg" width="25" />
    </button>
    <button>
      Move to Movies
      <img src="../assets/plextv-icon.svg" width="25" />
    </button>
    <button @click="test()">Start</button>
    <button>Stop</button>
  </div>
</template>

<script>
import { get, post } from '../functions';
import { AppState } from '../AppState';

export default {
  data() {
    return {
      vpnStatus: '-'
    };
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

    test() {
      AppState.$emit('openModal', { msg: 'Start torrent' });
    }
  },

  created() {
    get('/vpn-status').then(result => {
      this.vpnStatus = result.status;
    });
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

    &:active {
      background-color: #408fcf;
    }
  }

  .status-bar {
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
