export async function get(endpoint) {
  let response = await fetch(`http://localhost:3000${endpoint}`);
  let json = await response.json();
  return json;
}

export async function post(endpoint, payload) {
  let response = await fetch(`http://localhost:3000${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  let json = await response.json();
  return json;
}
