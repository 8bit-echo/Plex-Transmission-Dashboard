<template>
  <div id="app" :class="{hasGlobal:globalNotification != false}">
    <Notification />
    <StatusBar />
    <main ref="main">
      <router-view />
    </main>
    <Nav />
    <Modal />
  </div>
</template>

<script>
  import Nav from '@/components/Nav';
  import Notification from '@/components/Notification';
  import StatusBar from '@/components/StatusBar.vue';
  import Modal from '@/components/Modal.vue';
  import { mapState, mapMutations } from 'vuex';
  import { setGlobalTimers } from '@/functions';

  export default {
    components: { Nav, Notification, StatusBar, Modal },

    computed: {
      ...mapState(['globalNotification'])
    },
    methods: {
      ...mapMutations(['DISPLAY_NOTIFICATION'])
    },

    created() {
      // this is on the touchscreen with no keyboard, and we only want the dashboard on that device.
      if (window.innerWidth === 800 && window.innerHeight === 480) {
        this.$router.push('/dashboard')
      }

      // get VPN Status and put on a 60 sec poll cycle.
      this.$store.dispatch('getVPNStatus');
      setGlobalTimers('vpn');
    }
  };
</script>
