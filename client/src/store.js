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
    globalNotification: false,
    selectedTorrent: null,
    vpnActive: false,
    modalOpen: false,
    modalText: '',
    modalConfirm: () => {},
    modalExtra: null
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
    DISPLAY_NOTIFICATION(state, { display, level, message }) {
      state.notificationVisible = display;
      state.notificationType = level;
      state.notificationText = message;

      setTimeout(() => {
        state.notificationVisible = false;
      }, 4500);
    },

    VPN_STATUS(state, payload) {
      if (state.vpnActive !== payload) {
        state.vpnActive = payload;
      }
    },

    TORRENT_SELECTED(state, value) {
      state.torrentSelected = value;
    },

    OPEN_MODAL(state, payload) {
      state.modalOpen = true;
      state.modalText = payload.msg;
      state.modalConfirm = payload.action;
      state.modalExtra = payload.extra;
    },

    CLOSE_MODAL(state) {
      state.modalOpen = false;
      state.modalText = '';
    },

    LOADING_INDICATOR(state, payload) {
      state.isLoading = payload;
    }
  },
  actions: {
    getVPNStatus({ commit, state }) {
      get('/vpn-status')
        .then(result => {
          if (state.vpnActive !== result.status) {
            commit('VPN_STATUS', result.status);
          }
        })
        .catch(error => {
          commit('DISPLAY_NOTIFICATION', {
            display: true,
            level: 'error',
            message: `${error.message} VPN status`
          });
        });
    }
  }
});
