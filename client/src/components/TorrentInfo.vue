<template>
  <div class="torrent-info modal open">

    <div class="dialog open">
      <div class="modal-content">
        more things here.
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TorrentInfo',

    data() {
      return {
        torrent: {
          activityDate: 1578082605,
          addedDate: 1577912896,
          bandwidthPriority: 0,
          comment: '',
          corruptEver: 0,
          creator: '',
          dateCreated: 0,
          desiredAvailable: 0,
          doneDate: 1577937877,
          downloadDir: '/media/mini/ServerSpace/Downloads/',
          downloadLimit: 100,
          downloadLimited: false,
          downloadedEver: 3048732064,
          error: 0,
          errorString: '',
          eta: -1,
          fileStats: [
            {
              bytesCompleted: 341819064,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 311521882,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 579482487,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 335663114,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 365142623,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 293325224,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 468659181,
              priority: 0,
              wanted: true
            },
            {
              bytesCompleted: 339933066,
              priority: 0,
              wanted: true
            }
          ],
          files: [
            {
              bytesCompleted: 341819064,
              length: 341819064,
              name:
                'The Witcher/Andrzej Sapkowski - Baptism of Fire The Witcher, Book 3 (Unabridged)/Baptism of Fire The Witcher, Book 3 (Unabridged).m4b'
            },
            {
              bytesCompleted: 311521882,
              length: 311521882,
              name:
                'The Witcher/Andrzej Sapkowski - Blood of Elves The Witcher, Book 1 (Unabridged)/Blood of Elves The Witcher, Book 1 (Unabridged).m4b'
            },
            {
              bytesCompleted: 579482487,
              length: 579482487,
              name:
                'The Witcher/Andrzej Sapkowski - Lady of the Lake The Witcher, Book 5 (Unabridged)/Lady of the Lake The Witcher, Book 5 (Unabridged).m4b'
            },
            {
              bytesCompleted: 335663114,
              length: 335663114,
              name:
                'The Witcher/Andrzej Sapkowski - Season of Storms (Unabridged)/Season of Storms (Unabridged).m4b'
            },
            {
              bytesCompleted: 365142623,
              length: 365142623,
              name:
                'The Witcher/Andrzej Sapkowski - Sword of Destiny (Unabridged)/Sword of Destiny (Unabridged).m4b'
            },
            {
              bytesCompleted: 293325224,
              length: 293325224,
              name:
                'The Witcher/Andrzej Sapkowski - The Last Wish (Unabridged)/The Last Wish (Unabridged).m4b'
            },
            {
              bytesCompleted: 468659181,
              length: 468659181,
              name:
                'The Witcher/Andrzej Sapkowski - The Tower of the Swallow The Witcher, Book 4 (Unabridged)/The Tower of the Swallow The Witcher, Book 4 (Unabridged).m4b'
            },
            {
              bytesCompleted: 339933066,
              length: 339933066,
              name:
                'The Witcher/Andrzej Sapkowski - Time of Contempt The Witcher, Book 2 (Unabridged)/Time of Contempt The Witcher, Book 2 (Unabridged).m4b'
            }
          ],
          hashString: 'a18f51e8292c1aca5fe2048083e8112c4db4b127',
          haveUnchecked: 0,
          haveValid: 3035546641,
          honorsSessionLimits: true,
          id: 65,
          isFinished: false,
          isPrivate: false,
          leftUntilDone: 0,
          magnetLink:
            'magnet:?xt=urn:btih:a18f51e8292c1aca5fe2048083e8112c4db4b127&dn=The%20Witcher&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.open-internet.nl%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A69691337%2Fannounce&tr=udp%3A%2F%2Ftracker.vanitycore.co%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.baravik.org%3A6970%2Fannounce&tr=http%3A%2F%2Fretracker.telecom.by%3A80%2Fannounce&tr=http%3A%2F%2Ftracker.vanitycore.co%3A6969%2Fannounce',
          manualAnnounceTime: -1,
          maxConnectedPeers: 50,
          metadataPercentComplete: 1,
          name: 'The Witcher',
          'peer-limit': 50,
          peers: [
            {
              address: '2.248.178.69',
              clientIsChoked: true,
              clientIsInterested: false,
              clientName: 'qBittorrent 4.1.8',
              flagStr: 'T?E',
              isDownloadingFrom: false,
              isEncrypted: true,
              isIncoming: false,
              isUTP: true,
              isUploadingTo: false,
              peerIsChoked: false,
              peerIsInterested: false,
              port: 17826,
              progress: 0,
              rateToClient: 0,
              rateToPeer: 0
            },
            {
              address: '35.134.234.167',
              clientIsChoked: true,
              clientIsInterested: false,
              clientName: 'qBittorrent 4.1.8',
              flagStr: 'T?E',
              isDownloadingFrom: false,
              isEncrypted: true,
              isIncoming: false,
              isUTP: true,
              isUploadingTo: false,
              peerIsChoked: false,
              peerIsInterested: false,
              port: 8999,
              progress: 0,
              rateToClient: 0,
              rateToPeer: 0
            },
            {
              address: '85.244.196.76',
              clientIsChoked: true,
              clientIsInterested: false,
              clientName: '-UW107Q-',
              flagStr: 'TEX',
              isDownloadingFrom: false,
              isEncrypted: true,
              isIncoming: false,
              isUTP: true,
              isUploadingTo: false,
              peerIsChoked: true,
              peerIsInterested: false,
              port: 45059,
              progress: 1,
              rateToClient: 0,
              rateToPeer: 0
            },
            {
              address: '187.104.216.202',
              clientIsChoked: true,
              clientIsInterested: false,
              clientName: 'qBittorrent 4.2.1',
              flagStr: 'T?E',
              isDownloadingFrom: false,
              isEncrypted: true,
              isIncoming: false,
              isUTP: true,
              isUploadingTo: false,
              peerIsChoked: false,
              peerIsInterested: false,
              port: 23572,
              progress: 0,
              rateToClient: 0,
              rateToPeer: 0
            }
          ],
          peersConnected: 4,
          peersFrom: {
            fromCache: 0,
            fromDht: 0,
            fromIncoming: 0,
            fromLpd: 0,
            fromLtep: 0,
            fromPex: 1,
            fromTracker: 3
          },
          peersGettingFromUs: 0,
          peersSendingToUs: 0,
          percentDone: 1,
          pieceCount: 724,
          pieceSize: 4194304,
          pieces:
            '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8A==',
          priorities: [0, 0, 0, 0, 0, 0, 0, 0],
          rateDownload: 0,
          rateUpload: 0,
          recheckProgress: 0,
          seedIdleLimit: 30,
          seedIdleMode: 0,
          seedRatioLimit: 2,
          seedRatioMode: 0,
          sizeWhenDone: 3035546641,
          startDate: 1577937591,
          status: 6,
          torrentFile:
            '/home/mini/.config/transmission/torrents/The Witcher.a18f51e8292c1aca.torrent',
          totalSize: 3035546641,
          trackerStats: [
            {
              announce: 'udp://tracker.coppersurfer.tk:6969',
              announceState: 1,
              downloadCount: 3025,
              hasAnnounced: true,
              hasScraped: true,
              host: 'udp://tracker.coppersurfer.tk:6969',
              id: 0,
              isBackup: false,
              lastAnnouncePeerCount: 80,
              lastAnnounceResult: 'Success',
              lastAnnounceStartTime: 1578084555,
              lastAnnounceSucceeded: true,
              lastAnnounceTime: 1578084555,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Connection failed',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: true,
              lastScrapeTime: 1578084555,
              lastScrapeTimedOut: 0,
              leecherCount: 36,
              nextAnnounceTime: 1578086190,
              nextScrapeTime: 1578086360,
              scrape: 'udp://tracker.coppersurfer.tk:6969',
              scrapeState: 1,
              seederCount: 148,
              tier: 0
            },
            {
              announce: 'udp://tracker.leechers-paradise.org:6969',
              announceState: 1,
              downloadCount: 4180,
              hasAnnounced: true,
              hasScraped: true,
              host: 'udp://tracker.leechers-paradise.org:6969',
              id: 1,
              isBackup: false,
              lastAnnouncePeerCount: 80,
              lastAnnounceResult: 'Success',
              lastAnnounceStartTime: 1578084904,
              lastAnnounceSucceeded: true,
              lastAnnounceTime: 1578084904,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Could not connect to tracker',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: true,
              lastScrapeTime: 1578084904,
              lastScrapeTimedOut: 1,
              leecherCount: 46,
              nextAnnounceTime: 1578086845,
              nextScrapeTime: 1578086710,
              scrape: 'udp://tracker.leechers-paradise.org:6969',
              scrapeState: 1,
              seederCount: 177,
              tier: 1
            },
            {
              announce: 'udp://tracker.torrent.eu.org:451/announce',
              announceState: 1,
              downloadCount: 4888,
              hasAnnounced: true,
              hasScraped: true,
              host: 'udp://tracker.torrent.eu.org:451',
              id: 2,
              isBackup: false,
              lastAnnouncePeerCount: 80,
              lastAnnounceResult: 'Success',
              lastAnnounceStartTime: 1578084205,
              lastAnnounceSucceeded: true,
              lastAnnounceTime: 1578084205,
              lastAnnounceTimedOut: false,
              lastScrapeResult: '',
              lastScrapeStartTime: 1578082291,
              lastScrapeSucceeded: true,
              lastScrapeTime: 1578084205,
              lastScrapeTimedOut: 0,
              leecherCount: 21,
              nextAnnounceTime: 1578086130,
              nextScrapeTime: 1578086010,
              scrape: 'udp://tracker.torrent.eu.org:451/scrape',
              scrapeState: 1,
              seederCount: 138,
              tier: 2
            },
            {
              announce: 'udp://tracker.open-internet.nl:6969/announce',
              announceState: 1,
              downloadCount: 4197,
              hasAnnounced: true,
              hasScraped: true,
              host: 'udp://tracker.open-internet.nl:6969',
              id: 3,
              isBackup: false,
              lastAnnouncePeerCount: 80,
              lastAnnounceResult: 'Success',
              lastAnnounceStartTime: 1578084532,
              lastAnnounceSucceeded: true,
              lastAnnounceTime: 1578084532,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Could not connect to tracker',
              lastScrapeStartTime: 1578081110,
              lastScrapeSucceeded: true,
              lastScrapeTime: 1578084532,
              lastScrapeTimedOut: 0,
              leecherCount: 43,
              nextAnnounceTime: 1578086222,
              nextScrapeTime: 1578086340,
              scrape: 'udp://tracker.open-internet.nl:6969/scrape',
              scrapeState: 1,
              seederCount: 178,
              tier: 3
            },
            {
              announce: 'udp://tracker.opentrackr.org:69691337/announce',
              announceState: 1,
              downloadCount: -1,
              hasAnnounced: true,
              hasScraped: true,
              host: 'udp://tracker.opentrackr.org:-1',
              id: 4,
              isBackup: false,
              lastAnnouncePeerCount: 0,
              lastAnnounceResult: 'Connection failed',
              lastAnnounceStartTime: 0,
              lastAnnounceSucceeded: false,
              lastAnnounceTime: 1578083773,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Connection failed',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: false,
              lastScrapeTime: 1578083263,
              lastScrapeTimedOut: 0,
              leecherCount: -1,
              nextAnnounceTime: 1578090998,
              nextScrapeTime: 1578090480,
              scrape: 'udp://tracker.opentrackr.org:69691337/scrape',
              scrapeState: 1,
              seederCount: -1,
              tier: 4
            },
            {
              announce: 'udp://tracker.vanitycore.co:6969/announce',
              announceState: 0,
              downloadCount: -1,
              hasAnnounced: false,
              hasScraped: false,
              host: 'udp://tracker.vanitycore.co:6969',
              id: 5,
              isBackup: true,
              lastAnnouncePeerCount: 0,
              lastAnnounceResult: '',
              lastAnnounceStartTime: 0,
              lastAnnounceSucceeded: false,
              lastAnnounceTime: 0,
              lastAnnounceTimedOut: false,
              lastScrapeResult: '',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: false,
              lastScrapeTime: 0,
              lastScrapeTimedOut: 0,
              leecherCount: -1,
              nextAnnounceTime: 0,
              nextScrapeTime: 0,
              scrape: 'udp://tracker.vanitycore.co:6969/scrape',
              scrapeState: 0,
              seederCount: -1,
              tier: 5
            },
            {
              announce: 'http://tracker.vanitycore.co:6969/announce',
              announceState: 1,
              downloadCount: -1,
              hasAnnounced: true,
              hasScraped: true,
              host: 'http://tracker.vanitycore.co:6969',
              id: 8,
              isBackup: false,
              lastAnnouncePeerCount: 0,
              lastAnnounceResult: 'Could not connect to tracker',
              lastAnnounceStartTime: 0,
              lastAnnounceSucceeded: false,
              lastAnnounceTime: 1578082454,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Could not connect to tracker',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: false,
              lastScrapeTime: 1578078720,
              lastScrapeTimedOut: 0,
              leecherCount: -1,
              nextAnnounceTime: 1578089663,
              nextScrapeTime: 1578085940,
              scrape: 'http://tracker.vanitycore.co:6969/scrape',
              scrapeState: 1,
              seederCount: -1,
              tier: 5
            },
            {
              announce: 'http://tracker.baravik.org:6970/announce',
              announceState: 1,
              downloadCount: -1,
              hasAnnounced: true,
              hasScraped: true,
              host: 'http://tracker.baravik.org:6970',
              id: 6,
              isBackup: false,
              lastAnnouncePeerCount: 0,
              lastAnnounceResult: 'Could not connect to tracker',
              lastAnnounceStartTime: 0,
              lastAnnounceSucceeded: false,
              lastAnnounceTime: 1578082667,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Could not connect to tracker',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: false,
              lastScrapeTime: 1578083860,
              lastScrapeTimedOut: 0,
              leecherCount: -1,
              nextAnnounceTime: 1578089896,
              nextScrapeTime: 1578091110,
              scrape: 'http://tracker.baravik.org:6970/scrape',
              scrapeState: 1,
              seederCount: -1,
              tier: 6
            },
            {
              announce: 'http://retracker.telecom.by:80/announce',
              announceState: 1,
              downloadCount: -1,
              hasAnnounced: true,
              hasScraped: true,
              host: 'http://retracker.telecom.by:80',
              id: 7,
              isBackup: false,
              lastAnnouncePeerCount: 0,
              lastAnnounceResult: 'Could not connect to tracker',
              lastAnnounceStartTime: 0,
              lastAnnounceSucceeded: false,
              lastAnnounceTime: 1578083127,
              lastAnnounceTimedOut: false,
              lastScrapeResult: 'Could not connect to tracker',
              lastScrapeStartTime: 0,
              lastScrapeSucceeded: false,
              lastScrapeTime: 1578084741,
              lastScrapeTimedOut: 0,
              leecherCount: -1,
              nextAnnounceTime: 1578090331,
              nextScrapeTime: 1578091950,
              scrape: 'http://retracker.telecom.by:80/scrape',
              scrapeState: 1,
              seederCount: -1,
              tier: 7
            }
          ],
          trackers: [
            {
              announce: 'udp://tracker.coppersurfer.tk:6969',
              id: 0,
              scrape: 'udp://tracker.coppersurfer.tk:6969',
              tier: 0
            },
            {
              announce: 'udp://tracker.leechers-paradise.org:6969',
              id: 1,
              scrape: 'udp://tracker.leechers-paradise.org:6969',
              tier: 1
            },
            {
              announce: 'udp://tracker.torrent.eu.org:451/announce',
              id: 2,
              scrape: 'udp://tracker.torrent.eu.org:451/scrape',
              tier: 2
            },
            {
              announce: 'udp://tracker.open-internet.nl:6969/announce',
              id: 3,
              scrape: 'udp://tracker.open-internet.nl:6969/scrape',
              tier: 3
            },
            {
              announce: 'udp://tracker.opentrackr.org:69691337/announce',
              id: 4,
              scrape: 'udp://tracker.opentrackr.org:69691337/scrape',
              tier: 4
            },
            {
              announce: 'udp://tracker.vanitycore.co:6969/announce',
              id: 5,
              scrape: 'udp://tracker.vanitycore.co:6969/scrape',
              tier: 5
            },
            {
              announce: 'http://tracker.baravik.org:6970/announce',
              id: 6,
              scrape: 'http://tracker.baravik.org:6970/scrape',
              tier: 6
            },
            {
              announce: 'http://retracker.telecom.by:80/announce',
              id: 7,
              scrape: 'http://retracker.telecom.by:80/scrape',
              tier: 7
            },
            {
              announce: 'http://tracker.vanitycore.co:6969/announce',
              id: 8,
              scrape: 'http://tracker.vanitycore.co:6969/scrape',
              tier: 8
            }
          ],
          uploadLimit: 100,
          uploadLimited: false,
          uploadRatio: 1.713,
          uploadedEver: 5222672658,
          wanted: [1, 1, 1, 1, 1, 1, 1, 1],
          webseeds: [],
          webseedsSendingToUs: 0
        }
      };
    },

    mounted() {
      const { files } = this.torrent;
      const paths = files.map(file => file.name);
      // console.log(paths);

      const getTopLevelFiles = paths => {
        const top = [];
        paths.forEach(string => {
          top.push(string.split('/')[0]);
        });
        return [...new Set(top)];
      };

      const folders = getTopLevelFiles(paths);
      console.log(folders);
    }
  };
</script>

<style lang="scss" scoped>
  .modal {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;

    &.open {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
    }
  }

  .dialog {
    background: #3b3b48;
    color: white;
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
    padding: 0;
    top: 50%;
    transform: translateY(-50%);
    min-width: 66%;
    position: relative;
    display: none;
    margin: 0 15px;

    &.open {
      display: block;
    }

    .modal-content {
      padding: 40px 2rem 2rem;
      text-align: left;
    }

    .prompt {
      width: 95%;
      margin: 1rem auto;
      font-size: 1rem;
      padding: 0.5rem;
      text-align: center;
    }

    .actions {
      background: #2d2d38;
      display: flex;
      justify-content: space-around;

      button {
        width: 40%;
        font-family: 'Avenir', sans-serif;
        display: block;
        background-color: #3b3b48;
        color: white;
        border-radius: 5px;
        font-size: 1rem;
        padding: 1rem;
        margin: 1rem auto;
        border: none;
        outline: none;
        box-shadow: 0 0 8px rgba(16, 10, 39, 0.5);
        display: flex;
        justify-content: space-around;
        align-items: center;

        &:active {
          background-color: #408fcf;
        }

        &.primary {
          background-color: #408fcf;
          &:active {
            background-color: darken(#408fcf, 10%);
          }
        }
      }
    }

    &::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    .exit {
      color: indianred;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 34px;
      line-height: 0.75;
      background: transparent;
      border: none;
      outline: none;
    }
  }
</style>