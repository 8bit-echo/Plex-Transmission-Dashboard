/// <reference types="react-scripts" />

declare global {

  interface AppState {
    torrents?: TxTorrent[];
    selectedTorrent: number;
    vpnStatus: string;
    isLoading: boolean;
  }
  
  interface StateProviderProps {
    children: any | Element | ChildNode[];
    reducer: Reducer;
    initialState: AppState;
  }

  interface Action {
    type: string,
    payload?: any
  }

  interface TorrentType {
    id : number,
    name: string,
    link? : URL,
    magnet?: URL
  }

  interface TxTorrent {
    activityDate: number;
    addedDate: number;
    bandwidthPriority: number;
    comment: string;
    corruptEver: number;
    creator: string;
    dateCreated: number;
    desiredAvailable: number;
    doneDate: number;
    downloadDir: string;
    downloadLimit: number;
    downloadLimited: boolean;
    downloadedEver: number;
    error: number;
    errorString: string;
    eta: number;
    fileStats: string;
    files: string;
    hashString: string;
    haveUnchecked: number;
    haveValid: number;
    honorsSessionLimits: boolean;
    id: number;
    isFinished: boolean;
    isPrivate: boolean;
    key?: number;
    leftUntilDone: number;
    magnetLink: string;
    manualAnnounceTime: number;
    maxConnectedPeers: number;
    metadataPercentComplete: number;
    name: string;
    "peer-limit": number;
    peers: string;
    peersConnected: number;
    peersFrom: string;
    peersGettingFromUs: number;
    peersSendingToUs: number;
    percentDone: number;
    pieceCount: number;
    pieceSize: number;
    pieces: string;
    priorities: string;
    rateDownload: number;
    rateUpload: number;
    recheckProgress: number;
    seedIdleLimit: number;
    seedIdleMode: number;
    seedRatioLimit: number;
    seedRatioMode: number;
    sizeWhenDone: number;
    startDate: number;
    status: number;
    torrentFile: string;
    totalSize: number;
    trackerStats: string;
    trackers: string;
    uploadLimit: number;
    uploadLimited: boolean;
    uploadRatio: number;
    uploadedEver: number;
    wanted: string;
    webseeds: string;
    webseedsSendingToUs: number;
  }
}

export default global;