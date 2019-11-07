require('dotenv').config();
const express = require('express');
const useLocalData = process.env.LOCAL_DATA || false;
const app = express();
const port = 2113;
const Transmission = require('transmission-promise');
const tx = new Transmission({
  host: process.env.TX_HOST,
  port: 9091,
  username: process.env.TX_USER,
  password: process.env.TX_PASS
});

app.use(express.static('../client/dist'));
app.use(express.json());
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
  console.log(`using local data: ${useLocalData}`);
});

app.get('/ping', (_, res) => {
  res.send({ success: true });
});

app.get('/torrents', (_, res) => {
  const path = require('path');
  const dummyData = require(path.resolve('../dummy-data.json'));
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

app.get('/vpn-status', (_, res) => {
  const { getVPNStatus } = require('./functions');
  if (useLocalData) {
    res.send({ status: true });
  } else {
    console.log('got request for vpn status');
    const status = getVPNStatus();

    status.then(status => {
      if (status && status.length) {
        status = true;
      } else {
        status = false;
      }
      res.send(JSON.stringify({ status }));
    }).catch(error => {
      status = false;
      res.send(JSON.stringify({ status }));
    });
  }
});

app.post('/vpn', (req, res) => {
  const { enableVPN } = require('./functions');
  console.log('request to modify vpn');
  console.log(req.body);
  const response = {};

  if (req.body.action == 'stop') {
    const { disableVPN } = require('./functions');
    const result = disableVPN();
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
  const {
    getTVFolders,
    guessTVShow,
    extractSeasonNumber
  } = require('./functions');
  const { torrentName } = req.body;
  console.log(`got request to guess TV Show for file: ${torrentName}`);
  let show = '';
  getTVFolders().then(folders => {
    show = guessTVShow(torrentName, folders);
    if (!show || show === '') {
      res.send({ msg: `Unable to match to an existing folder`, error: true });
    } else {
      const season = extractSeasonNumber(torrentName, true);

      res.send({ show, season });
    }
  });
});

app.post('/move-movie', (req, res) => {
  const { isDir, removeDirtyFiles, moveToMovies } = require('./functions');
  console.log('got request to move movie file.');
  const { name } = req.body;

  isDir(name)
    .then(isDir => {
      if (isDir) {
        removeDirtyFiles(name).then(_ => {
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
  const {
    tvShows,
    isDir,
    removeDirtyFiles,
    moveToTVShows
  } = require('./functions');
  const { torrent, season, show } = req.body;
  const seasonPath = `${tvShows}/${show}/${season}`;

  isDir(torrent.name)
    .then(isDir => {
      if (isDir) {
        console.log('is a directory');
        removeDirtyFiles(torrent.name).then(result => {
          moveToTVShows(torrent.name, seasonPath).then(success => {
            res.send({ success });
          });
        });
      } else {
        console.log('is a file');
        moveToTVShows(torrent.name, seasonPath).then(success => {
          res.send({ success });
        });
      }
    })
    .catch(err => {
      console.log(`caught error trying to move TV show. ${err}`);
      res.send({ success: false, err });
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

app.post('/torrents', (req, res) => {
  console.log('got request to remove torrent from list.');
  const { id } = req.body;
  console.log(`removing torrent with ID: ${id} from list`);
  tx.remove(id).then(response => {
    res.send(response);
  });
});

app.post('/pause', (req, res) => {
  const { id, action } = req.body;
  console.log(`got request to ${action} a torrent`);

  tx[action](id).then(response => {
    res.send(response);
  });
});

app.post('/search', (req, res) => {
  console.log('got request to search for torrents');
  const path = require('path');
  const { getZooqleResults, get1337xResults } = require('./scraper');
  const searchData = require(path.resolve('../search-data.json'));
  const { search } = req.body;
  console.log(req.body);

  if (useLocalData) {
    res.send(searchData);
  } else {
    if (search.length) {
      Promise.all([getZooqleResults(search), get1337xResults(search)])
        .then(results => {
          res.send(
            JSON.stringify({
              zooqle: results[0],
              _1337x: results[1]
            })
          );
        })
        .catch(error => {
          res.send({ error });
        });
    } else {
      res.send(null);
    }
  }
});

app.get('/magnet', (req, res) => {
  console.log('getting magnet link');
  const { get1337xMagnet } = require('./scraper');

  try {
    const { link } = req.query;
    get1337xMagnet(link).then(magnet => {
      tx.addUrl(magnet).then(_ => {
        res.send(JSON.stringify({ success: true }));
      });
    });
  } catch (error) {
    console.log('error when getting or adding 1337x torrent.');
    res.send(JSON.stringify({ success: false, msg: error }));
  }
});

app.get('/torrent', (req, res) => {
  console.log('adding torrent to transmission...');
  const { magnet } = req.query;
  console.log(magnet);
  tx.addUrl(magnet)
    .then(_ => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(success => {
      res.send({ success: false });
    });
});
