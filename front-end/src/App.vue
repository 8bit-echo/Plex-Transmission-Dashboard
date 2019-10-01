<template>
  <div id="app" class="container">
    <controls :selectedTorrent="selectedTorrent" />
    <transmission :selectedTorrent="selectedTorrent" />
    <modal />
  </div>
</template>

<script>
import Vue from 'vue';
import Controls from './components/Controls';
import Transmission from './components/Transmission';
import Modal from './components/Modal';

export default Vue.extend({
  name: 'app',
  components: {
    Controls,
    Transmission,
    Modal
  },
  data() {
    return {
      selectedTorrent: {
        id: null
      }
    };
  },

  mounted() {
    this.$root.$on('changeSelectedTorrent', torrent => {
      this.selectedTorrent = torrent;
    });
  }
});
</script>

<style lang="scss">
html {
  overflow: hidden;
  height: 100vh;
  // cursor: none !important;
}
body {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: 'Avenir', sans-serif;
  letter-spacing: 0.75px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  width: 100%;
  height: 99.9%;
  display: grid;
  grid-template-columns: calc(100% / 3) auto;
  overflow: hidden;
}
</style>
