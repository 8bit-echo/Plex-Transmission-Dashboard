import { computed, reactive } from 'vue';
import { Actions, Mutations } from '../constants';
import { store } from '../store';

const useTorrents = () => {
  const torrents = reactive(computed(() => store.state.torrents));
  const selectedTorrent = computed(() => store.state.selectedTorrent);

  const deselectTorrents = () => {
    store.commit(Mutations.torrentSelected, null);
  };

  const select = (torrent: Transmission.Torrent) => {
    store.commit(Mutations.torrentSelected, torrent);
  };

  const getTorrents = () => {
    store.dispatch(Actions.getTorrents);
  };

  return { torrents, selectedTorrent, deselectTorrents, select, getTorrents };
};

export { useTorrents };
