import Vue from 'vue';
import Vuex from 'vuex';
import {post} from '@/functions';

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
    modalText: '',
  },

  getters: {
    totalDownloadSpeed() {
      return 0;
    },

    finishedTorrents() {
      return 0;
    },

    playPauseText() {
      return 'Start';
    },
  },

  mutations: {
    DISPLAY_NOTIFICATION(state, value){
      state.notificationVisible = value;
    },

    VPN_STATUS(state, payload) {
      state.vpnActive = payload;
    }
  },
  actions: {}
});
