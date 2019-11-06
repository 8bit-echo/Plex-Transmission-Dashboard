<template>
  <div id="app">
    <Notification />
    <StatusBar />
    <main>
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
  
  export default {
    components: { Nav, Notification, StatusBar, Modal },

    created() {
      this.$store.dispatch('getVPNStatus');

      setInterval(() => {
        this.$store.dispatch('getVPNStatus');
      }, 1000 * 60);
    }
  };
</script>
