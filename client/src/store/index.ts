import { createStore, Store } from 'vuex';
import AppError from '../AppError';
import { get, toHuman } from '../functions';
import { InjectionKey } from 'vue';
import { State } from '../@types/Store';
import { TorrentDashboard } from '../@types';

// define injection key
const key: InjectionKey<Store<State>> = Symbol();

const store = createStore<State>({
  state: {
    isLoading: false,
    notificationText: 'default notification text',
    notificationType: '',
    notificationVisible: false,
    globalNotification: undefined,
    vpnActive: false,
    modalOpen: false,
    modalText: '',
    modalConfirm: () => {},
    modalExtra: null,
    torrents: [],
    selectedTorrent: undefined,
    activeUsers: { size: 0 },
  },

  getters: {
    totalDownloadSpeed(state) {
      if (state.torrents.length >= 2) {
        const bytes = state.torrents.reduce((a, { rateDownload }) => {
          return a + rateDownload;
        }, 0);
        return toHuman(bytes);
      } else if (state.torrents.length === 1) {
        return toHuman(state.torrents[0].rateDownload);
      }
      return '';
    },

    finishedTorrents(state) {
      if (state.torrents.length) {
        return state.torrents.filter((torrent) => torrent.percentDone == 1)
          .length;
      }
    },

    torrents(state) {
      return state.torrents;
    },
  },

  mutations: {
    DISPLAY_NOTIFICATION(
      state,
      { display, level, message }: TorrentDashboard.NotificationOptions
    ) {
      state.notificationVisible = display;
      state.notificationType = level;
      state.notificationText = message;

      setTimeout(() => {
        state.notificationVisible = false;
      }, 4500);
    },

    GLOBAL_NOTIFICATION(state, msg: string) {
      state.globalNotification = msg;
    },

    VPN_STATUS(state, payload: boolean) {
      if (state.vpnActive !== payload) {
        state.vpnActive = payload;
      }
    },

    TORRENT_SELECTED(state, value?: Transmission.Torrent) {
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
    },

    ACTIVE_USERS(state, payload) {
      state.activeUsers = payload;
    },
  },

  actions: {
    async getVPNStatus({ commit, state }) {
      try {
        const result = await get('/vpn-status');
        if (
          result.hasOwnProperty('status') &&
          state.vpnActive !== result.status
        ) {
          commit('VPN_STATUS', result.status);
        }
      } catch (error) {
        new AppError(error);
      }
    },

    async getTorrents({ commit }) {
      try {
        const { torrents } = await get('/torrents');
        if (torrents) {
          commit('TORRENTS_CHANGED', torrents);
        }
      } catch (error) {
        new AppError(`Unable to get list of torrents ${error.message}`);
      }
    },

    async getActiveUsers({ commit, state }) {
      try {
        const users = await get('/sessions');
        if (users !== state.activeUsers) {
          commit('ACTIVE_USERS', users);
        }
      } catch (error) {
        new AppError('Unable to get active users');
      }
    },
  },
});

export { store, key };
