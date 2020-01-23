<template>
  <div
    class="transmission"
    @click.self="deselectTorrents()"
  >
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

  import { mapState, mapMutations } from 'vuex';
  export default {
    components: {
      Torrent
    },

    computed: {
      ...mapState(['torrents', 'selectedTorrent'])
    },

    methods: {
      ...mapMutations(['TORRENT_SELECTED']),

      /**
       * Deselect a torrent by tapping in dead space
       */
      deselectTorrents() {
        this.TORRENT_SELECTED(null);
      }
    }
  };
</script>

<style lang="scss">
  .transmission {
    padding: 1em;
    padding-bottom: 40px;
    overflow-y: scroll;
    color: white;
    padding-bottom: 165px;
  }
</style>