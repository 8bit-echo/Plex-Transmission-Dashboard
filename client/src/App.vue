<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script>
  import Nav from '@/components/Nav';
  export default {
    components: { Nav }
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
  }
</style>
