<template>
  <section id="status">
    <div
      v-if="!!globalNotification"
      :class="['global-notification', !!globalNotification]"
    >
      {{ globalNotification }}
    </div>
    <div
      :class="['status-bar', { hasGlobal: !!globalNotification }]"
      ref="statusBar"
    >
      <div class="left">
        <div class="vpnStatus indicator">
          VPN
          <div :class="{ statusLight: true, active: vpnActive }"></div>
        </div>
      </div>
      <div class="right">
        <div class="activity-indicator indicator" v-if="activeUsers.size > 0">
          <span class="user-count">{{ activeUsers.size }}</span>
          <div class="icon">
            <img src="../assets/activity-icon.svg" width="25" />
          </div>
          <div class="tooltip">
            <p v-for="session in activeUsers.sessions" :key="session.user">
              {{ session.user }}
            </p>
          </div>
        </div>

        <div class="finished indicator" v-show="finishedTorrents > 0">
          {{ finishedTorrents }} ✓
        </div>

        <div class="download indicator" v-show="totalDownloadSpeed !== ''">
          ↓ {{ totalDownloadSpeed }}/s
        </div>

        <div class="loading-indicator indicator" v-if="isLoading">
          <img src="../assets/spinner.svg" width="25" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useNotifications } from '../composables/useNotifications';
  import { useVPN } from '../composables/useVPN';
  import { setStatusBarColor } from '../functions';
  import { key } from '../store';
  export default defineComponent({
    setup() {
      const store = useStore(key);
      const { vpnActive } = useVPN();
      const { globalNotification } = useNotifications();

      const isLoading = computed(() => store.state.isLoading);
      const activeUsers = computed(() => store.state.activeUsers);
      const totalDownloadSpeed = computed(() => store.getters.totalDownloadSpeed);
      const finishedTorrents = computed(() => store.getters.finishedTorrents);

      /**
       * this is really only used for the PWA on iPhones with a notch to make the notification feel more native.
       */
      const changeStatusBarColor = () => {
        if (
          globalNotification.value &&
          typeof globalNotification.value === 'string'
        ) {
          switch (globalNotification.value.toLowerCase()) {
            case 'offline': {
              setStatusBarColor('#605f73');
            }
          }
        } else {
          setStatusBarColor();
        }

        onMounted(() => {
          changeStatusBarColor();
        });
      };

      return {
        vpnActive,
        globalNotification,
        isLoading,
        activeUsers,
        totalDownloadSpeed,
        finishedTorrents,
      };
    },

    // watch: {
    //   globalNotification() {
    //     this.changeStatusBarColor();
    //   },
    // },
  });
</script>

<style lang="scss" scoped>
  #status {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
    background-color: rgba(0, 0, 0, 0.15);
    padding-top: 20px;
  }

  .global-notification {
    background-color: #605f73;

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
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .indicator {
      display: flex;
      align-items: center;
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

    .activity-indicator {
      margin: 0 10px;
      .user-count {
        display: block;
        position: relative;
        font-size: 11px;
        bottom: -3px;
        left: 0;
        color: #e5a00d;
        align-self: flex-end;
        padding-right: 5px;
      }
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #e5a00d;

        img {
          max-width: 20px;
        }
      }

      &:hover {
        .tooltip {
          visibility: visible;
          transform: translateY(20px);
          transition: transform 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
      }

      .tooltip {
        pointer-events: none;
        visibility: hidden;
        background: #111;
        color: white;
        position: absolute;
        bottom: -22px;
        padding: 0.5rem 2rem;
        border-radius: 7px;
        right: 5px;
        font-size: 12px;

        p {
          margin: 0;
        }

        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          position: absolute;
          top: -5px;
          right: 10%;
          background: inherit;
          z-index: -1;
        }
      }
    }

    .finished {
      color: #cc7b19;
    }

    & > div {
      display: flex;
      justify-content: space-around;
    }
  }

  @media screen and (width: 375px) and (height: 768px) {
    #status {
      padding-top: 36px !important;
    }

    .global-notification {
      padding-top: 44px;
      margin-top: -44px;
    }
  }

  @media screen and (width: 375px) and (height: 647px) {
    #status {
      padding-top: 16px !important;
    }
  }
</style>