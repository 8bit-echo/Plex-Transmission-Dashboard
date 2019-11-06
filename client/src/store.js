import Vue from 'vue';
import Vuex from 'vuex';
import { get /* post */ } from '@/functions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    notificationText: 'default notification text',
    notificationType: '',
    notificationVisible: false,
    selectedTorrent: null,
    vpnActive: false,
    modalOpen: false,
    modalText: ''
  },

  getters: {
    totalDownloadSpeed() {
      return '';
    },

    finishedTorrents() {
      return 0;
    },

    playPauseText() {
      return 'Start';
    }
  },

  mutations: {
    DISPLAY_NOTIFICATION(state, value) {
      state.notificationVisible = value;
    },

    VPN_STATUS(state, payload) {
      state.vpnActive = payload;
    },

    TORRENT_SELECTED(state, value) {
      state.torrentSelected = value;
    },

    OPEN_MODAL(state, payload) {
      state.modalOpen = true;
      state.modalText = payload.msg;
    },

    CLOSE_MODAL(state) {
      state.modalOpen = false;
      state.modalText = '';
    }
  },
  actions: {
    getVPNStatus({ commit }) {
      get('/vpn-status').then(result => {
        commit('VPN_STATUS', result.status);
      });
    }
  }
});
