const ESP_IP = '192.168.0.125'; // Replace with your ESP32 IP

function toggleRelay(relay, state) {
    fetch(`http://${ESP_IP}/api/${relay}${state}`)
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
}