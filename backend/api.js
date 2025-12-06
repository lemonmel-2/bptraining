

// ===== auth.js =====
const API_BASE = "http://localhost:5242/api/game"; // <-- change to your API

// Use in-memory by default (safer against XSS than localStorage).
// For page reload persistence, uncomment sessionStorage lines below.
const auth = {
  _token: null,

  setToken(token) {
    this._token = token || null;
    sessionStorage.setItem("accessToken", token || "");
  },
  getToken() {
    if (this._token) return this._token;
    const t = sessionStorage.getItem("accessToken");
    this._token = t || null;
    return this._token;
  },
  clear() {
    this._token = null;
    sessionStorage.removeItem("accessToken");
  },
};

// A small fetch wrapper that auto-adds Authorization header when available
async function apiFetch(path, options = {}) {
  const token = auth.getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(API_BASE + path, { ...options, headers });
  const payload = await res.json();
  // For non-2xx, throw a useful error
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    message = payload.code.message;
    const e = new Error(message);
    throw e;
  }

  return payload.data;
}

export function isLoggedIn(){
  return auth.getToken() ? true : false;
}

function setToken(data){
  if (!data || !data.accessToken) {
    throw new Error("Login response missing accessToken");
  }
  auth.setToken(data.accessToken);
}
// --- API calls ---

export async function login(userId, password) {
  const body = { userId: userId, password: password };
  const data = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  setToken(data);
  return data;
}

export async function register(userId, password) {
  const body = { userId: userId, password: password };
  const data = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  setToken(data);
  return data;
}

export async function recordScore(score) {
  const body = { score };
  const data = await apiFetch("/score", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}

export async function getLeaderboard() {
  const data = await apiFetch("/leaderboard", {
    method: "GET"
  });
  return data;
}

export async function getInventory() {
  const data = await apiFetch("/items", {
    method: "GET"
  });
  return data;
}

export async function getUser() {
  const data = await apiFetch("/user", {
    method: "GET"
  });
  return data;
}

export async function getRandomItem() {
  const data = await apiFetch("/item-random", {
    method: "GET"
  });
  return data;
}

export async function addItem(itemId) {
  const body = { itemId: itemId };
  const data = await apiFetch("/item-add", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return data;
}


