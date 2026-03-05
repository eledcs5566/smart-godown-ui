let esp=null;

const addresses=[

"http://smartgodown.local",
"http://192.168.4.1"

];

async function detectESP(){

for(let addr of addresses){

try{

await fetch(addr+"/api/alloff",{mode:"no-cors"});

esp=addr;

document.getElementById("status").innerText="Connected to "+addr;

return;

}catch(e){}

}

document.getElementById("status").innerText="ESP not detected";

}

function send(cmd){

if(!esp){

detectESP().then(()=>{

if(esp) fetch(esp+cmd);

});

return;

}

fetch(esp+cmd);

}

function updateStatus(){

if(!esp) return;

fetch(esp+"/api/status")

.then(res=>res.json())

.then(data=>{

document.getElementById("s1").innerText="R1 "+(data.r1?"●":"○");
document.getElementById("s2").innerText="R2 "+(data.r2?"●":"○");
document.getElementById("s3").innerText="R3 "+(data.r3?"●":"○");
document.getElementById("s4").innerText="R4 "+(data.r4?"●":"○");

});

}

setInterval(updateStatus,1000);

window.onload=detectESP;