<template>
  <div class="transmission" @click.self="deselectTorrents()">
    <torrent
      v-for="torrent in torrents"
      :key="torrent.id"
      :torrent="torrent"
      :selected="selectedTorrent && selectedTorrent.id === torrent.id"
    />
  </div>
</template>

<script>
import Torrent from './DashboardTorrent';

import {mapState, mapMutations} from 'vuex';
export default {
  components: {
    Torrent
  },
  
  computed: {
    ...mapState(['torrents', 'selectedTorrent']),
  },

  methods: {
    ...mapMutations(['TORRENT_SELECTED']),
    deselectTorrents() {
      this.TORRENT_SELECTED(null);
    }
  },
};
</script>

<style lang="scss">
.transmission {
  height: 100%;
  padding: 1em;
  overflow-y: auto;
  background-color: #3b3b48;
  color: white;
}
</style>