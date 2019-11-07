<template>
  <section id="status">
    <div
      v-if="globalNotification"
      :class="['global-notification', globalNotification]"
    >{{ globalNotification }}</div>
    <div
      :class="['status-bar', {hasGlobal: globalNotification !== false}]"
      ref="statusBar"
    >
      <div class="vpnStatus indicator">
        VPN
        <div :class="{ statusLight: true, active: vpnActive }"></div>
      </div>

      <div
        class="finished indicator"
        v-show="finishedTorrents > 0"
      >
        {{ finishedTorrents }} ✓
      </div>

      <div
        class="download indicator"
        v-show="totalDownloadSpeed !== ''"
      >
        {{ totalDownloadSpeed }} ↓
      </div>

      <div
        class="loading-indicator indicator"
        v-if="isLoading"
      >
        <img
          src="@/assets/spinner.svg"
          width="25"
        />
      </div>
    </div>
  </section>

</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  export default {
    computed: {
      ...mapState(['isLoading', 'vpnActive', 'globalNotification']),
      ...mapGetters(['totalDownloadSpeed', 'finishedTorrents'])
    },

    methods: {
      /**
       * this is really only used for the PWA on iPhones with a notch to make the notification feel more native.
       */
      changeStatusBarColor() {
        if (
          this.globalNotification &&
          typeof this.globalNotification === 'string'
        ) {
          switch (this.globalNotification.toLowerCase()) {
            case 'offline': {
              document.documentElement.style.setProperty('--topBarColor', 'grey');
            }
          }
        } else {
          document.documentElement.style.setProperty('--topBarColor', '#202027');
        }
      }
    },

    watch: {
      globalNotification() {
        this.changeStatusBarColor();
      }
    },
    
    mounted() {
      this.changeStatusBarColor();
    }
  };
</script>

<style lang="scss" scoped>
  #status {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
  }
  .global-notification {
    background-color: grey;

    &.Offline {
      &::before {
        content: '';
        height: 1.1rem;
        width: 1rem;
        display: inline-block;
        position: relative;
        bottom: -4px;
        left: -4px;
        background-image: url('../assets/offline.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
  }

  .status-bar {
    position: relative;
    z-index: 3;
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

    .finished {
      color: #2bca2b;
    }
  }
</style>