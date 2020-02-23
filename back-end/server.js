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

// https
//   .createServer(
//     {
//       key: fs.readFileSync(process.env.SSL_KEY_PATH),
//       cert: fs.readFileSync(process.env.SSL_CRT_PATH),
//     },
//     app,
//   ).listen(port, () => {

app.listen(port, () => {
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
    'status'
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

app.get('/vpn-status', async (_, res) => {
  const { getVPNStatus } = require('./functions');
  if (useLocalData) {
    res.send({ status: true });
  } else {
    console.log('got request for vpn status');
    try {
      const { status } = await getVPNStatus();
      res.send({ status });
    } catch (error) {
      res.send({ status: false });
    }
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
      res.send({ success: true });
    }, 2000);
  } else {
    disableVPN();
    setTimeout(() => {
      res.send({ success: true });
    }, 2500);
  }
});

app.post('/guess-tv-show', async (req, res) => {
  const {
    getTVFolders,
    guessTVShow,
    extractSeasonNumber
  } = require('./functions');
  const { torrentName } = req.body;
  console.log(`got request to guess TV Show for file: ${torrentName}`);
  let show = '';
  try {
    const folders = await getTVFolders();
    show = guessTVShow(torrentName, folders);
    if (!show || show === '') {
      res.send({
        msg: `Unable to match to an existing folder`,
        error: true,
        show: null,
        season: null
      });
    } else {
      const season = extractSeasonNumber(torrentName, true);
      res.send({ show, season });
    }
  } catch (error) {
    console.log(error);
    res.send({
      msg: `Something went wrong trying to get current TV Shows`,
      error: true,
      show: null,
      season: null
    });
  }
});

app.post('/new-show', async (req, res) => {
  console.log('new show incoming...');
  const { makeDir, tvShows, extractSeasonNumber } = require('./functions');
  const { show, torrent } = req.body;
  if (show) {
    const season = extractSeasonNumber(torrent, true);

    //make directory for show name
    try {
      const success = await makeDir(`${tvShows}/${show}`);
      res.send({ success, season });
    } catch (error) {
      res.send({ success: false, season: null });
    }
  }
});

app.post('/move-movie', async (req, res) => {
  const { isDir, removeDirtyFiles, moveToMovies } = require('./functions');
  console.log('got request to move movie file.');
  const { name } = req.body;

  try {
    const isDirectory = await isDir(name);
    if (isDirectory) {
      const cleaned = await removeDirtyFiles(name);
      if (cleaned) {
        const success = moveToMovies(name);
        res.send({ success });
      }
    } else {
      const success = await moveToMovies(name);
      res.send({ success });
    }
  } catch (error) {
    console.log(`caught error determining if torrent was a folder ${err}`);
  }
});

app.post('/move-tv-show', async (req, res) => {
  const {
    tvShows,
    isDir,
    removeDirtyFiles,
    moveToTVShows
  } = require('./functions');
  const { torrent, season, show } = req.body;
  const seasonPath = `${tvShows}/${show}/${season}`;

  try {
    const isDirectory = await isDir(torrent.name);
    if (isDirectory) {
      const cleaned = await removeDirtyFiles(torrent.name);
      if (cleaned) {
        const success = await moveToTVShows(torrent.name, seasonPath);
        res.send({ success });
      }
    } else {
      const success = await moveToTVShows(torrent.name, seasonPath);
      res.send({ success });
    }
  } catch (error) {
    console.log(`caught error trying to move TV show. ${err}`);
    res.send({ success: false, err });
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
        res.send({
          success: false,
          error: 'Failed to remove torrent from Transmission'
        });
      });
  }
});

app.post('/pause', (req, res) => {
  let { id, action } = req.body;
  if (action === 'pause') {
    action = 'stop';
  }

  console.log(`got request to ${action} a torrent`);

  tx[action](id).then(response => {
    res.send(response);
  });
});

app.post('/search', (req, res) => {
  console.log('got request to search for torrents');
  const path = require('path');
  const { allEngines } = require('./TorrentProvider');
  console.log(allEngines);
  const searchData = require(path.resolve('../search-data.json'));
  const { search } = req.body;
  console.log(req.body);

  if (useLocalData) {
    res.send(searchData);
  } else {
    if (search.length) {
      Promise.all(
        allEngines.map(Engine => {
          return new Engine().getResults(search);
        })
      ).then(results => {
        res.send(
          Object.fromEntries(
            allEngines.map((Engine, i) => [
              new Engine().options.name,
              results[i]
            ])
          )
        );
      });
    } else {
      res.send({ success: false });
    }
  }
});

app.get('/magnet', (req, res) => {
  console.log('getting magnet link');
  const _1337x = require('./TorrentProvider')._1337x;
  const { link } = req.query;

  new _1337x()
    .getMagnetFromSingle(link)
    .then(magnet => {
      tx.addUrl(magnet)
        .then(_ => {
          res.send(JSON.stringify({ success: true }));
        })
        .catch(e => {
          console.log('error adding to Transmission', e);
          res.send({ success: false, msg: e.msg });
        });
    })
    .catch(e => {
      console.log('error getting single', e);
      res.send({ success: false, msg: e.msg });
    });
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

app.get('/sessions', async (_, res) => {
  // console.log('getting active user sessions...');
  const request = require('request-promise-native');
  if (!process.env.PLEX_SERVER_URL || !process.env.PLEX_TOKEN) {
    res.send({ users: 0 });
    return;
  }

  const headers = {
    Accept: 'application/json',
    'X-Plex-Token': process.env.PLEX_TOKEN
  };
  try {
    const plexResponse = await request({
      uri: `${process.env.PLEX_SERVER_URL}/status/sessions`,
      headers,
      json: true
    });

    if (plexResponse.MediaContainer) {
      const responseObject = {
        size: plexResponse.MediaContainer.size,
        sessions: plexResponse.MediaContainer.Metadata.map(session => {
          return {
            user: session.User.title,
            media: session.title
          }
        })

      }
      res.send(responseObject);
      return;
    }
  } catch (error) {
    res.send({ users: false });
  }
  res.send({ users: false });
});

app.get('/dashboard', (_, res) => {
  res.redirect('/');
});
