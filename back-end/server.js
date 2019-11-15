require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const useLocalData = process.env.LOCAL_DATA || false;
const app = express();
const port = 2113;
const Transmission = require('transmission-promise');
const tx = new Transmission({
  host: process.env.TX_HOST,
  port: 9091,
  username: process.env.TX_USER,
  password: process.env.TX_PASS,
});


app.use(express.static('../client/dist'));
app.use(express.json());
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

https.createServer({
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CRT_PATH)
},app).listen(port, () => {
  console.log(`app running on port ${port}`);
  console.log(`using local data: ${useLocalData}`);
});

app.get('/ping', (_, res) => {
  console.log('PING');
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
    // 'peersConnected',
    // 'peersGettingFromUs',
    // 'peersSendingToUs',
    'percentDone',
    // 'queuePosition',
    'rateDownload',
    // 'rateUpload',
    // 'recheckProgress',
    // 'seedRatioMode',
    // 'seedRatioLimit',
    'sizeWhenDone',
    'status',
    // 'trackers',
    // 'downloadDir',
    // 'uploadedEver',
    // 'uploadRatio',
    // 'webseedsSendingToUs'
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
    getVPNStatus()
      .then(status => {
        res.send({ status });
      })
      .catch(error => {
        status = false;
        res.send({ status });
      });
  }
});

app.post('/vpn', (req, res) => {
  console.log('request to modify vpn');
  const { enableVPN, disableVPN } = require('./functions');
  const { toggle } = req.body;

  console.log('set VPN to: ', toggle);

  if (toggle) {
    enableVPN();
    setTimeout(() => {
      res.send({ success : true});
    }, 2000);
  } else {
    disableVPN()
    setTimeout(() => {
      res.send({ success : true});
    }, 1000);
  }

});

app.post('/guess-tv-show', (req, res) => {
  const { getTVFolders, guessTVShow, extractSeasonNumber } = require('./functions');
  const { torrentName } = req.body;
  console.log(`got request to guess TV Show for file: ${torrentName}`);
  let show = '';
  getTVFolders().then(folders => {
    show = guessTVShow(torrentName, folders);
    if (!show || show === '') {
      res.send({ msg: `Unable to match to an existing folder`, error: true, show: null, season: null });
    } else {
      const season = extractSeasonNumber(torrentName, true);

      res.send({ show, season });
    }
  });
});

app.post('/new-show', (req, res) => {
  console.log('new show incoming...');
  const { makeDir, tvShows, extractSeasonNumber } = require('./functions');
  const { show, torrent } = req.body;
  if (show) {
    //make directory for show name
    makeDir(`${tvShows}/${show}`).then(success => {
      const season = extractSeasonNumber(torrent, true);
      res.send({ success: true, season });
    });
  }
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
  const { tvShows, isDir, removeDirtyFiles, moveToTVShows } = require('./functions');
  const { torrent, season, show } = req.body;
  const seasonPath = `${tvShows}/${show}/${season}`;

  isDir(torrent.name)
    .then(isDir => {
      if (isDir) {
        removeDirtyFiles(torrent.name).then(result => {
          moveToTVShows(torrent.name, seasonPath).then(success => {
            res.send({ success });
          });
        });
      } else {
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
  console.log(`removing torrent with ID: ${id} from list`);
  const { id } = req.body;

  if (useLocalData) {
    res.send({ success: true });
  } else {
    tx.remove(id)
      .then(() => {
        res.send({ success: true });
      })
      .catch(error => {
        console.log('failed to remove torrent from Transmission');
        console.log(error);
        res.send({ success: false, error: 'Failed to remove torrent from Transmission' });
      });
  }
});

app.post('/torrents', (req, res) => {
  if (useLocalData) {
    res.send({ success: true });
  } else {
    const { id } = req.body;
    console.log(`removing torrent with ID: ${id} from list`);
    tx.remove(id)
      .then(() => {
        res.send({ success: true });
      })
      .catch(error => {
        console.log('failed to remove torrent from Transmission');
        console.log(error);
        res.send({ success: false, error: 'Failed to remove torrent from Transmission' });
      });
  }
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
              _1337x: results[1],
            }),
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

app.get('/dashboard', (req, res) => {
  res.redirect('/');
});