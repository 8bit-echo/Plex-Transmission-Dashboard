/**
 * convenience method via fetch API for GET requests.
 */
export async function get(endpoint) {
  let response = await fetch(`http://${process.env.VUE_APP_HOST}${endpoint}`);
  let json = await response.json();
  return json;
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
