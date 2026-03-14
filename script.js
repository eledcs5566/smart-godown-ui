// DEFAULT ESP IP
let ESP_BASE = "http://10.254.6.114";

// ALLOW IP FROM URL
const urlParams = new URLSearchParams(window.location.search);

if(urlParams.has("ip")){
ESP_BASE = "http://" + urlParams.get("ip").trim();
}

// ELEMENTS
const STATUS=document.getElementById("connection-status");
const OLED_IMG=document.getElementById("oled-feed");

// FETCH JSON
async function fetchJson(endpoint){

const res=await fetch(`${ESP_BASE}${endpoint}`,{cache:"no-store"});

if(!res.ok) throw new Error("HTTP "+res.status);

return await res.json();
}

// UPDATE DASHBOARD
async function updateDashboard(){

try{

const data=await fetchJson("/status");

document.getElementById("motion").innerText=data.motion?"ON":"OFF";

document.getElementById("clap").innerText=data.clap?"ON":"OFF";

for(let i=1;i<=4;i++)
{
document.getElementById(`s${i}`).classList.toggle("active",i===data.section);
}

// OLED image refresh
OLED_IMG.src=`${ESP_BASE}/oled.bmp?${Date.now()}`;

STATUS.textContent="Connected";
STATUS.className="status online";

}

catch(e){

STATUS.textContent="Offline / No connection";
STATUS.className="status offline";

}

}

// SEND COMMAND
async function sendCommand(path){

try{

await fetch(`${ESP_BASE}${path}`);
setTimeout(updateDashboard,400);

}catch(e){}

}

// BUTTON COMMANDS
function relay(n){sendCommand(`/r${n}`)}

function allOn(){sendCommand("/allon")}

function allOff(){sendCommand("/alloff")}

function toggleMotion(){sendCommand("/motion")}

function toggleClap(){sendCommand("/clap")}

// AUTO UPDATE
updateDashboard();
setInterval(updateDashboard,3000);
