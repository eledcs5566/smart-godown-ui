// DEFAULT ESP IP
let ESP_BASE = "http://10.254.6.114";

// GET IP FROM URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("ip")) {
  ESP_BASE = "http://" + urlParams.get("ip").trim();
}

// ELEMENTS
const STATUS = document.getElementById("connection-status");
const OLED_IMG = document.getElementById("oled-feed");

// SAFE COMMAND (no logic, just send)
async function send(path) {
  try {
    await fetch(`${ESP_BASE}${path}`);
  } catch (e) {}
}

// FETCH JSON
async function fetchJson(endpoint) {
  const res = await fetch(`${ESP_BASE}${endpoint}`, { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.json();
}

// UPDATE DASHBOARD
async function updateDashboard() {
  try {
    const data = await fetchJson("/status");

    document.getElementById("motion").innerText = data.motion ? "ON" : "OFF";
    document.getElementById("clap").innerText = data.clap ? "ON" : "OFF";

    for (let i = 1; i <= 4; i++) {
      document.getElementById(`s${i}`).classList.toggle("active", i === data.section);
    }

    // OLED refresh
    OLED_IMG.src = `${ESP_BASE}/oled.bmp?${Date.now()}`;

    STATUS.textContent = "Connected";
    STATUS.className = "status online";

  } catch (e) {
    STATUS.textContent = "Offline / No connection";
    STATUS.className = "status offline";
  }
}

// 🔥 FORCE MANUAL CONTROL
async function forceManual() {
  try {
    // Turn OFF automation safely (only if ON)
    const data = await fetchJson("/status");

    if (data.motion) await send("/motion");
    if (data.clap) await send("/clap");

  } catch (e) {}
}

// COMMANDS

async function relay(n) {
  await forceManual();         // disable auto first
  await send(`/r${n}`);
  setTimeout(updateDashboard, 400);
}

async function allOn() {
  await forceManual();         // disable auto first
  await send("/allon");
  setTimeout(updateDashboard, 500);
}

async function allOff() {
  await send("/alloff");
  setTimeout(updateDashboard, 400);
}

async function toggleMotion() {
  await send("/motion");
  setTimeout(updateDashboard, 400);
}

async function toggleClap() {
  await send("/clap");
  setTimeout(updateDashboard, 400);
}

// AUTO UPDATE
updateDashboard();
setInterval(updateDashboard, 3000);
