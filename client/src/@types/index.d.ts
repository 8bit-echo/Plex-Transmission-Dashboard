export namespace TorrentDashboard {
  interface POSTOptions {
    search?: string;
    toggle?: boolean;
    torrentName?: string;
    show?: string;
    torrent?: string;
    season?: string;
    id?: number;
    action?: string;
  }
  type POSTPayload = POSTOptions | Transmission.Torrent;

  type NotificationType = 'okay' | 'error' | 'warning' | '' | undefined;

  interface NotificationOptions {
    display: boolean;
    level?: NotificationType;
    message?: string | undefined;
  }

  type ActiveUsers = {
    size: number;
    sessions?: {
      user: string;
      media: string;
    }[];
  };

  interface SearchResultItem {
    id: number;
    name: string;
    size: string;
    seeds: string;
    magnet?: string;
    link?: string;
  }

  type SearchResults = Record<string, SearchResultItem[]>;

  type Torrent = Transmission.Torrent
}
