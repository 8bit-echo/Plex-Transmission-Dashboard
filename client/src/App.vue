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
    components: { Nav, Notification, StatusBar, Modal }
  };
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100vw;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; /* enables “momentum” (smooth) scrolling */
    background: #3b3b48;
  }
  main {
    padding-top: 32px;
  }
</style>
