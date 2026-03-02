const ESP_IP = '10.195.133.35'; // Replace with your ESP32 IP

function toggleRelay(relay, state) {
    fetch(`http://${ESP_IP}/api/${relay}${state}`)
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
}