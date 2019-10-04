const useLocalData = false;

const fs = require('fs');
const path = require('path');
const dummyData = require(path.resolve('../dummy-data.json'));
const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const port = 3000;
const Transmission = require('transmission-promise');
const tx = new Transmission({
  host: '192.168.0.29',
  port: 9091,
  username: process.env.TX_USER,
  password: process.env.TX_PASS
});
const {
  serverRoot,
  downloads,
  tvShows,
  movies,
  getVPNStatus,
  disableVPN,
  enableVPN,
  getTVFolders,
  guessTVShow,
  extractSeasonNumber,
  isDir,
  removeDirtyFiles,
  moveToMovies,
  moveToTVShows
} = require('./functions');
const fields = [
  'id',
  'error',
  'errorString',
  'eta',
  'isFinished',
  'isStalled',
  'leftUntilDone',
  'metadataPercentComplete',
  'peersConnected',
  // 'peersGettingFromUs',
  'peersSendingToUs',
  'percentDone',
  'queuePosition',
  'rateDownload',
  // 'rateUpload',
  // 'recheckProgress',
  // 'seedRatioMode',
  // 'seedRatioLimit',
  'sizeWhenDone',
  'status',
  // 'trackers',
  'downloadDir',
  // 'uploadedEver',
  // 'uploadRatio',
  'webseedsSendingToUs'
];

app.use(express.static('../front-end/dist'));
app.use(express.json());

app.listen(port, () => {
  console.log(`app running on port ${3000}`);
});

app.get('/active', (req, res) => {
  console.log('got request to retrieve active torrents');
  tx.active()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send(err);
      console.error(err);
    });
});

app.get('/torrents', (req, res) => {
  console.log('got request to retrieve all torrents');
  if (useLocalData) {
    res.send({ torrents: dummyData });
  } else {
    tx.all('', fields)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send(err);
        console.error(err);
      });
  }
});

app.get('/vpn-status', (req, res) => {
  if (useLocalData) {
    res.send({ status: 'ACTIVE' });
  } else {
    console.log('got request for vpn status');
    const status = getVPNStatus();

    status.then(status => {
      if (status.length) {
        status = 'ACTIVE';
      } else {
        status = 'INACTIVE';
      }
      res.send(JSON.stringify({ status }));
    });
  }
});

app.post('/vpn', (req, res) => {
  console.log('request to modify vpn');
  console.log(req.body);
  const response = {};

  if (req.body.action == 'stop') {
    const result = disableVPN();
    console.log(`server:66 result: ${result}`);
    if (!result.error) {
      response.success = true;
      response.status = 'INACTIVE';
    }
  } else if (req.body.action == 'start') {
    const result = enableVPN();
    response.success = true;
    response.status = 'ACTIVE';
  } else {
    res.status(400).send();
  }
  res.send(response);
});

app.post('/guess-tv-show', (req, res) => {
  const { torrentName } = req.body;
  console.log(`got request to guess TV Show for file: ${torrentName}`);
  let show = '';
  getTVFolders().then(folders => {
    show = guessTVShow(torrentName, folders);
    if (!show) {
      res.send({ msg: `Unable to match to an existing folder`, error: true });
    } else {
      const season = extractSeasonNumber(torrentName, true);

      res.send({ show, season });
    }
  });
});

app.post('/move-movie', (req, res) => {
  console.log('got request to move movie file.');
  const { name } = req.body;

  isDir(name)
    .then(isDir => {
      if (isDir) {
        removeDirtyFiles(name).then(result => {
          moveToMovies(name).then(success => {
            res.send({ success });
          });
        });
      } else {
        moveToMovies(name).then(success => {
          res.send({ success });
        });
      }
    })
    .catch(err => {
      console.log(`caught error determining if torrent was a folder ${err}`);
    });
});

app.post('/move-tv-show', (req, res) => {
  const { torrent, season, show } = req.body;
  const seasonPath = `${tvShows}/${show}/${season}`;

  isDir(torrent.name)
    .then(isDir => {
      if (isDir) {
        console.log('is a directory');
        removeDirtyFiles(torrent.name).then(result => {
          moveToTVShows(torrent.name, seasonPath).then(success => {
            res.send({success});
          });
        });
      } else {
        console.log('is a file');
        moveToTVShows(torrent.name, seasonPath).then(success => {
          res.send({success});
        });
      }
    })
    .catch(err => {
      console.log(`caught error trying to move TV show. ${err}`);
      res.send({success: false, err});
    });
});

app.delete('/torrents', (req, res) => {
  console.log('got request to remove torrent from list.');
  const { id } = req.body;
  console.log(`removing torrent with ID: ${id} from list`);
  tx.remove(id).then(response => {
    res.send(response);
  });
});

app.post('/pause', (req, res) => {
  const {id, action} = req.body;
  console.log(`got request to going to ${action} a torrent`);

  tx[action](id).then(response => {
    res.send(response);
  });

})
