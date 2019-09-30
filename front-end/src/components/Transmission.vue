<template>
  <div class="transmission">
    <torrent v-for="torrent in torrents" :key="torrent.id" :torrent="torrent" />
  </div>
</template>

<script>
import Torrent from "./Torrent";
import { get } from "../functions";
export default {
  components: {
    Torrent
  },
  data() {
    return {
      torrents: []
    };
  },

  mounted() {
    get("/torrents").then(data => {
      this.torrents = data.torrents;
    });
    // console.log(this.torrents);
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
