// CONFIG

let ESP_BASE = "http://esp32.local";

const urlParams = new URLSearchParams(window.location.search);

if(urlParams.has("ip"))
{
ESP_BASE = "http://" + urlParams.get("ip").trim();
}

// ELEMENTS

const STATUS = document.getElementById("connection-status");
const OLED_IMG = document.getElementById("oled-feed");


// FETCH JSON FROM ESP

async function fetchJson(endpoint)
{
  const res = await fetch(`${ESP_BASE}${endpoint}`, {cache:"no-store"});

  if(!res.ok) throw new Error("HTTP " + res.status);

  return await res.json();
}


// UPDATE DASHBOARD

async function updateDashboard()
{

  try{

    const data = await fetchJson("/status");

    document.getElementById("motion").innerText = data.motion ? "ON" : "OFF";

    document.getElementById("clap").innerText = data.clap ? "ON" : "OFF";

    document.getElementById("energy").innerText =
      Number(data.energy).toFixed(3) + " kWh";


    // SECTION DOTS

    for(let i=1;i<=4;i++)
    {
      document
        .getElementById(`s${i}`)
        .classList.toggle("active", i === data.section);
    }


    // OLED STREAM

    OLED_IMG.src = `${ESP_BASE}/oled.bmp?${Date.now()}`;


    STATUS.textContent = "Connected";
    STATUS.className = "status online";

  }

  catch(e){

    STATUS.textContent = "Offline / No connection";
    STATUS.className = "status offline";

  }

}


// SEND COMMAND TO ESP

async function sendCommand(path)
{

  try{

    await fetch(`${ESP_BASE}${path}`);

    setTimeout(updateDashboard, 400);

  }

  catch(e){}

}


// RELAY CONTROL

function relay(n)
{
  sendCommand(`/r${n}`);
}


// ALL ON / OFF

function allOn()
{
  sendCommand("/allon");
}

function allOff()
{
  sendCommand("/alloff");
}


// TOGGLE SYSTEMS

function toggleMotion()
{
  sendCommand("/motion");
}

function toggleClap()
{
  sendCommand("/clap");
}


// INITIAL LOAD

updateDashboard();

setInterval(updateDashboard, 3000);