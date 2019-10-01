import Vue from 'vue';
import { Application } from './main';

export const AppState = new Vue({
  data: {
    selectedTorrent: {
      id: null
    },
    torrents: []
  },
  created() {
    this.$on('gotTorrents', payload => {
      this.torrents = payload;
    });

    this.$on('openModal', payload => {
      Application.$emit('openEmit', payload);
      console.log(payload);
    });

    this.$on('torrentSelect', payload => {
      this.selectedTorrent = payload;
      Application.$emit('changeSelectedTorrent', payload);
    });
  }
});
