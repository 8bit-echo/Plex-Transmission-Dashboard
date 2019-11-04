<template>
  <div id="dashboard" class="container">
    <Controls :selectedTorrent="selectedTorrent" />
    <Transmission :selectedTorrent="selectedTorrent" />
  </div>
</template>

<script>
import Vue from 'vue';
import Controls from '@/components/Controls';
import Transmission from '@/components/Transmission';

export default Vue.extend({
  name: 'app',
  components: {
    Controls,
    Transmission,
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

.container {
  width: 100%;
  height: 99.9%;
  display: grid;
  grid-template-columns: calc(100% / 3) auto;
  overflow: hidden;

  @media screen and (max-width: 415px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
}
</style>
