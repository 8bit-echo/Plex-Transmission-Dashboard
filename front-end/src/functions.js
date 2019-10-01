export async function get(endpoint) {
  let response = await fetch(`http://localhost:3000${endpoint}`);
  let json = await response.json();
  return json;
}

export async function post(endpoint, payload) {
  let response = await fetch(`http://localhost:3000${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  let json = await response.json();
  return json;
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
