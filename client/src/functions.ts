import { TorrentDashboard } from './@types';
import AppError from './AppError';
import { Actions, Mutations } from './constants';
import { store } from './store';

/**
 * convenience method via fetch API for GET requests.
 */
export async function get(endpoint: string) {
  try {
    let response = await fetch(
      `http://${import.meta.env.VITE_APP_HOST}${endpoint}`
    );
    let json = await response.json();
    return json;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      fetch(`http://${import.meta.env.VITE_APP_HOST}/ping`)
        .then((res) => res.json())
        .then((json) => console.log(`ping recieved JSON: ${json}`))
        .catch(() => {
          offlineHandler();
        });
    }
  }
}

/**
 * convenience method via fetch API for POST requests.
 */
export async function post(
  endpoint: string,
  payload: TorrentDashboard.POSTPayload
) {
  try {
    let response = await fetch(
      `http://${import.meta.env.VITE_APP_HOST}${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    let json = await response.json();
    return json;
  } catch (error) {
    new AppError(error);
  }
}

/**
 * convenience method via fetch API for DELETE requests.
 */
export async function _delete(endpoint: string, payload: { id: number }) {
  let response = await fetch(
    `http://${import.meta.env.VITE_APP_HOST}${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
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
    height: window.screen.height * ratio,
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
export function toHuman(bytes?: number): string {
  if (!bytes) return '';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
}

/**
 *  change the status bar color on PWA for notched iOS devices.
 */
export function setStatusBarColor(color = '#202027') {
  document.documentElement.style.setProperty('--topBarColor', color);
}

/**
 * sets global offline notification as well as establishing heartbeat for when we're reconnected to the server. Tears down fetch requests.
 */
export async function offlineHandler() {
  //display offline global statusbar notification.
  store.commit(Mutations.globalNotification, 'Offline');
  // set vpn off.
  store.commit(Mutations.VPNStatus, false);
  // set Active users to 0.
  store.commit(Mutations.activeUsers, false);

  // clear all timers on fetching new resources.
  clearInterval(window.vpnTimer);
  clearInterval(window.torrentTimer);
  clearInterval(window.sessionTimer);

  // check heartbeat every 10 sec.
  window.onlineCheck = setInterval(async () => {
    console.log('checking for connection with server...');

    try {
      const json = await (
        await fetch(`http://${import.meta.env.VITE_APP_HOST}/ping`)
      ).json();
      if (json && json.success) {
        // received heartbeat from server.
        console.log('back online with server...');
        store.commit(Mutations.globalNotification, undefined);
        store.dispatch(Actions.getVPNStatus);

        console.log('clearing all timers');
        // clear the heartbeat timer and reinstate the other timers.
        clearInterval(window.onlineCheck);
        clearInterval(window.vpnTimer);
        clearInterval(window.torrentTimer);
        clearInterval(window.sessionTimer);
        setGlobalTimers();
      }
    } catch (error) {
      console.log('still offline');
    }
  }, 1000 * 10);
}

/**
 * sets all timers if no arguments are passed, or sets a single timer if it's string name is passed.
 */
export function setGlobalTimers(timerName?: string) {
  switch (timerName) {
    case 'torrents':
      console.log('setting torrentTimer');
      window.torrentTimer = setInterval(() => {
        store.dispatch(Actions.getTorrents);
      }, 1000 * 7);
      break;

    case 'vpn':
      console.log('setting vpnTimer');
      window.vpnTimer = setInterval(() => {
        store.dispatch(Actions.getVPNStatus);
      }, 1000 * 60);
      break;

    case 'sessions':
      console.log('setting active users timer');
      window.sessionTimer = setInterval(() => {
        store.dispatch(Actions.getActiveUsers);
      }, 1000 * 20);
      break;

    default:
      console.log('setting all timers');
      window.torrentTimer = setInterval(() => {
        store.dispatch(Actions.getTorrents);
      }, 1000 * 7);

      window.vpnTimer = setInterval(() => {
        store.dispatch(Actions.getVPNStatus);
      }, 1000 * 60);

      window.vpnTimer = setInterval(() => {
        store.dispatch(Actions.getActiveUsers);
      }, 1000 * 20);
      break;
  }
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
  ISOLATED: 7, // Torrent can't find peers
};
