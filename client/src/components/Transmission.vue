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
    // background: purple;
    // padding: 1em;
    // padding-bottom: 40px;
    // overflow-y: scroll;
    color: white;
    padding-bottom: 100px;

    @media screen and (max-width: 415px) {
      position:fixed;
      margin-top: 100px;
      height: calc(100vh - 70px);
      width: 100vw;
      overflow: scroll;
      padding-top: 80px;
      padding-bottom: 120px;
    }
  }
</style>