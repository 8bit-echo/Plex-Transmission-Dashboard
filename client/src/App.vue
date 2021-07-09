<template>
  <div id="app" :class="{ hasGlobal: globalNotification !== 'false' }">
    <!-- <Notification /> -->
    <StatusBar />
    <main ref="main">
      <router-view />
    </main>
    <Nav />
    <Modal />
  </div>
</template>

<script lang="ts">
  import Nav from './components/Nav.vue';
  import Notification from './components/Notification.vue';
  import StatusBar from './components/StatusBar.vue';
  import Modal from './components/Modal.vue';
  import { useStore } from 'vuex';
  import { setGlobalTimers } from './functions';
  import { computed, defineComponent, onMounted } from '@vue/runtime-core';
  import { useRouter } from 'vue-router';
  import { Actions } from './constants';
  import { key } from './store';
  import { useVPN } from './composables/useVPN';

  export default defineComponent({
    components: { Nav, Notification, StatusBar, Modal },

    setup() {
      const store = useStore(key);
      const router = useRouter();
      const { getVPNStatus } = useVPN();

      onMounted(() => {
        // this is on the touchscreen with no keyboard, and we only want the dashboard on that device.
        if (window.innerWidth === 800 && window.innerHeight === 480) {
          router.push('/dashboard');
        }
        // get VPN Status and put on a 60 sec poll cycle.
        getVPNStatus();
        setGlobalTimers('vpn');

        // get active Users.
        store.dispatch(Actions.getActiveUsers);
        setGlobalTimers('sessions');
      });

      const globalNotification = computed(() => store.state.globalNotification);

      return {
        globalNotification,
      };
    },
  });
</script>

<style lang="scss">
  @media screen and (min-width: 416px) {
    #dashboard {
      display: flex;
      margin-top: 75px;
    }

    .controls {
      width: clamp(250px, 35%, 400px);
    }

    .transmission {
      flex: 1;
      height: 90vh;
      overflow: scroll;
    }
  }
</style>
