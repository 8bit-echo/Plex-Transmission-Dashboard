<template>
  <div class="transmission" @click.self="deselectTorrents()">
    <torrent
      v-for="torrent in torrents"
      :key="torrent.id"
      :torrent="torrent"
      :selected="selectedTorrent.id === torrent.id"
    />
  </div>
</template>

<script>
import Torrent from './Torrent';
import { AppState } from '../AppState';
export default {
  components: {
    Torrent
  },

  props: ['selectedTorrent'],

  data() {
    return {
      torrents: []
    };
  },

  methods: {
    deselectTorrents() {
      AppState.$emit('torrentSelect', { id: null });
    }
  },

  mounted() {
    this.$root.$on('torrentsDidChange', torrents => {
      this.torrents = torrents;
    });
  }
};
</script>

<style lang="scss">
.transmission {
  width: 100%;
  height: 100vh;
  padding: 1em;
  overflow-y: auto;
  background-color: #3b3b48;
  color: white;
}
</style>
