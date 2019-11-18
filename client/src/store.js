import Vue from 'vue';
import Vuex from 'vuex';
import { get /* post */, toHuman } from '@/functions';
import AppError from '@/AppError';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    notificationText: 'default notification text',
    notificationType: '',
    notificationVisible: false,
    globalNotification: false,
    vpnActive: false,
    modalOpen: false,
    modalText: '',
    modalConfirm: () => { },
    modalExtra: null,
    torrents: [],
    selectedTorrent: null
  },

  getters: {
    totalDownloadSpeed(state) {
      if (state.torrents.length >= 2) {
        const bytes = state.torrents.reduce((a, b) => {
          return a.rateDownload + b.rateDownload;
        }, 0);
        return toHuman(bytes);
      } else if (state.torrents.length === 1) {
        return toHuman(state.torrents[0].rateDownload);
      }
      return '';
    },

    finishedTorrents(state) {
      if (state.torrents.length) {
        return state.torrents.filter(torrent => torrent.percentDone == 1)
          .length;
      }
    },

    torrents(state) {
      return state.torrents;
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

    GLOBAL_NOTIFICATION(state, msg) {
      state.globalNotification = msg;
    },

    VPN_STATUS(state, payload) {
      if (state.vpnActive !== payload) {
        state.vpnActive = payload;
      }
    },

    TORRENT_SELECTED(state, value) {
      state.selectedTorrent = value;
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
    },

    TORRENTS_CHANGED(state, payload) {
      state.torrents = payload;
    }
  },

  actions: {
    getVPNStatus({ commit, state }) {
      get('/vpn-status')
        .then(result => {
          if (result.status && state.vpnActive !== result.status) {
            commit('VPN_STATUS', result.status);
          }
        })
        .catch(error => {
          new AppError(error);
        });
    },

    getTorrents({ commit }) {
      get('/torrents').then(({ torrents }) => {
        if (torrents) {
          commit('TORRENTS_CHANGED', torrents);
        }
      }).catch(() => {
        new AppError('Unable to get list of torrents');
      });
    }
  }
});
