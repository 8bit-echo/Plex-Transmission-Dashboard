import Vue from 'vue';
import { Application } from './main';
import { get } from './functions';

export const AppState = new Vue({
  data: {
    selectedTorrent: {
      id: null
    },
    torrents: []
  },

  methods: {
    getTorrentData() {
      get('/torrents').then(data => {
        this.torrents = data.torrents;
        Application.$emit('torrentsDidChange', this.torrents);
      });
    }
  },

  created() {
    this.$on('openModal', payload => {
      Application.$emit('openEmit', payload);
      console.log(payload);
    });

    this.$on('torrentSelect', payload => {
      this.selectedTorrent = payload;
      Application.$emit('changeSelectedTorrent', payload);
    });

    this.$on('torrentListShouldChange', () => {
      console.log('torrent list should change');
      get('/torrents').then(data => {
        console.log('got fresh torrent data');
        this.torrents = data.torrents;
      });
      Application.$emit('torrentsDidChange', this.torrents);
    });

    this.getTorrentData();

    setInterval(() => {
      this.getTorrentData();
    }, 7000);
  }
});
