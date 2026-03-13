// CONFIG
let ESP_BASE = "http://10.191.227.114";

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('ip')) {
  ESP_BASE = "http://" + urlParams.get('ip').trim();
}

const STATUS = document.getElementById("connection-status");
const OLED_IMG = document.getElementById("oled-feed");

async function fetchJson(endpoint) {
  const res = await fetch(`${ESP_BASE}${endpoint}`, { cache: "no-store" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return await res.json();
}

async function updateDashboard() {
  try {
    const data = await fetchJson("/status");

    document.getElementById("motion").innerText =
      data.motion ? "ON" : "OFF";

    document.getElementById("clap").innerText =
      data.clap ? "ON" : "OFF";

    document.getElementById("energy").innerText =
      Number(data.energy).toFixed(3) + " kWh";

    for (let i = 1; i <= 4; i++) {
      document
        .getElementById(`s${i}`)
        .classList.toggle("active", i === data.section);
    }

    OLED_IMG.src = `${ESP_BASE}/oled.bmp?${Date.now()}`;

    STATUS.textContent = "Connected";
    STATUS.className = "status online";
  } 
  catch (err) {
    STATUS.textContent = "Offline / No connection";
    STATUS.className = "status offline";
  }
}

async function sendCommand(path) {
  try {
    await fetch(`${ESP_BASE}${path}`);
    setTimeout(updateDashboard, 300);
  } catch {}
}

function relay(n) { sendCommand(`/r${n}`); }

function allOn() { sendCommand("/allon"); }

function allOff() { sendCommand("/alloff"); }

function toggleMotion() { sendCommand("/motion"); }

function toggleClap() { sendCommand("/clap"); }

updateDashboard();
setInterval(updateDashboard, 3000);