import { computed } from 'vue';
import { TorrentDashboard } from '../@types';
import { Mutations } from '../constants';
import { store } from '../store';

const useNotifications = () => {
  const notificationVisible = computed(() => store.state.notificationVisible);
  const notificationType = computed(() => store.state.notificationType);
  const notificationText = computed(() => store.state.notificationText);
  const globalNotification = computed(() => store.state.globalNotification);

  const displayNotification = (
    payload: TorrentDashboard.NotificationOptions
  ) => {
    store.commit(Mutations.displayNotification, payload);
  };

  return {
    notificationVisible,
    notificationType,
    notificationText,
    globalNotification,
    displayNotification,
  };
};

export { useNotifications };
