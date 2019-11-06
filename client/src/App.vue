<template>
  <div id="app">
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

  export default {
    components: { Nav, Notification, StatusBar, Modal },

    computed: {
      ...mapState(['globalNotification'])
    },
    methods: {
      ...mapMutations(['DISPLAY_NOTIFICATION'])
    },

    created() {
      this.$store.dispatch('getVPNStatus');

      setInterval(() => {
        this.$store.dispatch('getVPNStatus');
      }, 1000 * 60);

      // if (this.globalNotification) {
      //   this.$refs.main.style.paddingTop = '50px';
      // }
    }
  };
</script>
