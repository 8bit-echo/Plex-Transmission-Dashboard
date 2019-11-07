export async function get(endpoint) {
  let response = await fetch(`http://${process.env.VUE_APP_HOST}${endpoint}`);
  let json = await response.json();
  return json;
}

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

export async function _delete(endpoint, payload) {
  let response = await fetch(`http://${process.env.VUE_APP_HOST}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  let json = await response.json();
  return json;
}

export function deviceType() {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Get the device pixel ratio
  var ratio = window.devicePixelRatio || 1;

  // Define the users device screen dimensions
  var screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio
  };

  // iPhone X Detection
  if (iOS && screen.width == 1125 && screen.height === 2436) {
    return 'iPhone X';
  }

  return iOS ? 'iOS' : 'Browser';
}

export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

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

export function toHuman(bytes) {
  if (!bytes) {
    return '';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
}
