<template>
  <div class="transmission" @click.self="deselectTorrents()">
    <Torrent
      v-for="torrent in torrents"
      :key="torrent.id"
      :torrent="torrent"
      :selected="selectedTorrent && selectedTorrent.id === torrent.id"
    />
  </div>
</template>

<script lang="ts">
  import Torrent from './DashboardTorrent.vue';
  import { defineComponent } from 'vue';
  import { useTorrents } from '../composables/useTorrents';

  export default defineComponent({
    components: {
      Torrent,
    },

    setup() {
      const { deselectTorrents, torrents, selectedTorrent } = useTorrents();

      return {
        torrents,
        selectedTorrent,
        deselectTorrents,
      };
    },
  });
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