let ESP_BASE = "http://10.254.6.114";

// GET IP
const params = new URLSearchParams(window.location.search);
if(params.has("ip")){
ESP_BASE = "http://" + params.get("ip");
}

const STATUS = document.getElementById("connection-status");
let activeSection = 0;

// UPDATE UI
function updateUI(){
for(let i=1;i<=4;i++){
document.getElementById(`s${i}`).classList.toggle("active",i===activeSection);
}

document.getElementById("active-label").innerText =
activeSection===0 ? "ALL OFF" : "SECTION "+activeSection;
}

// LOG SYSTEM
function log(msg){
let logBox=document.getElementById("logs");
let p=document.createElement("p");
p.innerText="→ "+msg;
logBox.prepend(p);
}

// FLASH EFFECT
function flash(){
document.body.style.background="#002b1a";
setTimeout(()=>{document.body.style.background="#0a0a0a";},150);
}

// COMMANDS
async function relay(n){

activeSection=n;
updateUI();
flash();
log("Section "+n+" Activated");

for(let i=0;i<2;i++){
await fetch(`${ESP_BASE}/r${n}`);
await new Promise(r=>setTimeout(r,150));
}
}

async function allOff(){

activeSection=0;
updateUI();
flash();
log("All Sections OFF");

await fetch(`${ESP_BASE}/alloff`);
}

// CONNECTION CHECK
async function checkConnection(){
try{
await fetch(`${ESP_BASE}/status`);
STATUS.textContent="Connected";
STATUS.className="status online";
}catch{
STATUS.textContent="Offline";
STATUS.className="status offline";
}
}

setInterval(checkConnection,3000);
updateUI();