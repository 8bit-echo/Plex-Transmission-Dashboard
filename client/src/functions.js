/**
 * convenience method via fetch API for GET requests.
 */
export async function get(endpoint) {
  try {
    let response = await fetch(`http://${process.env.VUE_APP_HOST}${endpoint}`);
    let json = await response.json();
    return json;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      fetch(`http://${process.env.VUE_APP_HOST}/ping`)
        .then(res => res.json())
        .then(json => console.log(`ping recieved JSON: ${json}`))
        .catch(() => {
          offlineHandler();
        })
    }
  }
}

/**
 * convenience method via fetch API for POST requests.
 */
export async function post(endpoint, payload) {
  try {
    let response = await fetch(
      `http://${process.env.VUE_APP_HOST}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    let json = await response.json();
    return json;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * convenience method via fetch API for DELETE requests.
 */
export async function _delete(endpoint, payload) {
  let response = await fetch(`http://${process.env.VUE_APP_HOST}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  let json = await response.json();
  return json;
}

/**
 * determine if device is a larger browser, iPhone, or iPhone X (any "notched" iPhone).
 */
export function deviceType() {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const ratio = window.devicePixelRatio || 1;
  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio
  };

  // iPhone X Detection
  if (iOS && screen.width == 1125 && screen.height === 2436) {
    return 'iPhone X';
  }

  return iOS ? 'iOS' : 'Browser';
}

/**
 * determine if app is running in browser or in standalone PWA mode.
 */
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * bytes to human readable data format
 */
export function toHuman(bytes) {
  if (!bytes) {
    return '';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, i)).toFixed(1) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}

/**
 *  change the status bar color on PWA for notched iOS devices.
 */
export function setStatusBarColor(color = '#202027') {
  document.documentElement.style.setProperty('--topBarColor', color);
}


export async function offlineHandler() {
  window.app.$store.commit('GLOBAL_NOTIFICATION', 'Offline');
  window.app.$store.commit('VPN_STATUS', false);
  clearInterval(window.vpnTimer);
  clearInterval(window.torrentTimer);

  window.onlineCheck = setInterval(() => {
    fetch(`http://${process.env.VUE_APP_HOST}/ping`)
      .then(res => res.json())
      .then(json => {
        if (json && json.success) {
          console.log('back online with server...');
          window.app.$store.commit('GLOBAL_NOTIFICATION', false);
          window.app.$store.dispatch('getVPNStatus');
          setGlobalTimers();
          clearInterval(window.onlineCheck);
        }
      }).catch(() => {
        console.log('still offline');
      })
  }, 1000 * 10);
}

export function setGlobalTimers(timerName = undefined) {

  switch (timerName) {
    case 'torrents':
      window.torrentTimer = setInterval(() => {
        window.app.$store.dispatch('getTorrents');
      }, 1000 * 7);
      break;

    case 'vpn':
      window.vpnTimer = setInterval(() => {
        window.app.$store.dispatch('getVPNStatus');
      }, 1000 * 60);
      break;

    default:
      window.torrentTimer = setInterval(() => {
        window.app.$store.dispatch('getTorrents');
      }, 1000 * 7);

      window.vpnTimer = setInterval(() => {
        window.app.$store.dispatch('getVPNStatus');
      }, 1000 * 60);
      break;
  }
}

export function freshTorrentsList() { }

/* These are constants used by Transmission RPC for status. */
export const txStatus = {
  STOPPED: 0, // Torrent is stopped
  CHECK_WAIT: 1, // Queued to check files
  CHECK: 2, // Checking files
  DOWNLOAD_WAIT: 3, // Queued to download
  DOWNLOAD: 4, // Downloading
  SEED_WAIT: 5, // Queued to seed
  SEED: 6, // Seeding
  ISOLATED: 7 // Torrent can't find peers
};
