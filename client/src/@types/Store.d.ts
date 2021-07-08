import { TorrentDashboard } from '.';

interface State {
  isLoading: boolean;
  notificationText?: string;
  notificationType: TorrentDashboard.NotificationType;
  notificationVisible: boolean;
  globalNotification?: string;
  vpnActive: boolean;
  modalOpen: boolean;
  modalText: string;
  modalConfirm: (args?: any | any[]) => void;
  modalExtra: any;
  torrents: Transmission.Torrent[];
  selectedTorrent?: Transmission.Torrent;
  activeUsers: TorrentDashboard.ActiveUsers;
}
