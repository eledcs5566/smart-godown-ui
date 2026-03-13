const ESP = "http://10.191.227.114";

/* UPDATE DASHBOARD */

async function updateDashboard(){

try{

const res = await fetch(ESP+"/status");
const data = await res.json();

document.getElementById("motion").innerText =
data.motion ? "ON":"OFF";

document.getElementById("clap").innerText =
data.clap ? "ON":"OFF";

document.getElementById("energy").innerText =
data.energy+" kWh";

/* SECTION DOTS */

for(let i=1;i<=4;i++)
document.getElementById("s"+i).classList.remove("active");

if(data.section>0)
document.getElementById("s"+data.section).classList.add("active");

}catch(e){

console.log("ESP offline");

}

}

/* RELAY CONTROL */

function relay(n){

fetch(ESP+"/r"+n);

}

/* ALL OFF */

function allOff(){

fetch(ESP+"/alloff");

}

/* MOTION */

function toggleMotion(){

fetch(ESP+"/motion");

}

/* CLAP */

function toggleClap(){

fetch(ESP+"/clap");

}

/* AUTO REFRESH */

setInterval(updateDashboard,2000);

updateDashboard();