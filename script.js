// ================================================
// CONFIG - Change this to match your ESP32 IP
// You can also add ?ip=192.168.x.x to the URL
// ================================================
let ESP_BASE = "http://10.191.227.114";   // ← your usual IP

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('ip')) {
  ESP_BASE = "http://" + urlParams.get('ip').trim();
}

const STATUS = document.getElementById("connection-status");
const OLED_IMG = document.getElementById("oled-feed");

// Helper: fetch JSON from ESP
async function fetchJson(endpoint) {
  try {
    const res = await fetch(`\( {ESP_BASE} \){endpoint}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    throw err;
  }
}

// Update dashboard status + OLED image
async function updateDashboard() {
  try {
    const data = await fetchJson("/status");

    document.getElementById("motion").innerText = data.motion ? "ON" : "OFF";
    document.getElementById("clap").innerText   = data.clap   ? "ON" : "OFF";
    document.getElementById("energy").innerText = Number(data.energy).toFixed(3) + " kWh";

    for (let i = 1; i <= 4; i++) {
      document.getElementById(`s${i}`).classList.toggle("active", i === data.section);
    }

    // Refresh OLED screenshot (add timestamp to bypass cache)
    OLED_IMG.src = `\( {ESP_BASE}/oled.bmp? \){Date.now()}`;

    STATUS.textContent = `Connected • ${new Date().toLocaleTimeString()}`;
    STATUS.className = "status online";

  } catch (err) {
    console.warn("Dashboard update failed:", err);
    STATUS.textContent = "Offline / No connection";
    STATUS.className = "status offline";
  }
}

// Send command (relay, toggle, all on/off)
async function sendCommand(path) {
  try {
    await fetch(`\( {ESP_BASE} \){path}`);
    // Quick refresh after command
    setTimeout(updateDashboard, 400);
  } catch (err) {
    console.warn("Command failed:", path);
  }
}

// Command wrappers
function relay(n)       { sendCommand(`/r${n}`); }
function allOn()        { sendCommand("/allon"); }
function allOff()       { sendCommand("/alloff"); }
function toggleMotion() { sendCommand("/motion"); }
function toggleClap()   { sendCommand("/clap"); }

// Start + auto-refresh
updateDashboard();
setInterval(updateDashboard, 3000);