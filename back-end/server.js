const useLocalData = true;

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
  password: process.env.TX_PASS,
});
const fn = require('./functions');
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
  'peersGettingFromUs',
  'peersSendingToUs',
  'percentDone',
  'queuePosition',
  'rateDownload',
  'rateUpload',
  'recheckProgress',
  'seedRatioMode',
  'seedRatioLimit',
  'sizeWhenDone',
  'status',
  'trackers',
  'downloadDir',
  'uploadedEver',
  'uploadRatio',
  'webseedsSendingToUs',
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
    const status = fn.getVPNStatus();

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
    const result = fn.disableVPN();
    console.log(`server:66 result: ${result}`);
    if (!result.error) {
      response.success = true;
      response.status = 'INACTIVE';
    }
  } else if (req.body.action == 'start') {
    const result = fn.enableVPN();
    response.success = true;
    response.status = 'ACTIVE';
  } else {
    res.status(400).send();
  }
  res.send(response);
});
