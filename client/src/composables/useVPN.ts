import { computed } from 'vue';
import AppError from '../AppError';
import { Mutations, Actions } from '../constants';
import { post } from '../functions';
import { store } from '../store';

const useVPN = () => {
  const vpnActive = computed(() => store.state.vpnActive);

  const toggleVPN = async () => {
    store.commit(Mutations.loadingIndicator, true);
    const vpn = await post('/vpn', { toggle: !vpnActive.value });
    if (vpn.success) {
      store.dispatch(Actions.getVPNStatus);
    } else {
      new AppError('failed to toggle VPN');
    }
    store.commit(Mutations.loadingIndicator, false);
  };

  const getVPNStatus = () => {
    store.dispatch(Actions.getVPNStatus);
  };

  return { vpnActive, toggleVPN, getVPNStatus };
};

export { useVPN };
