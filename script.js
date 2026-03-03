<script>
  const espIP = "http://192.168.0.125";

  function send(command) {
    fetch(`${espIP}/api/${command}`)
      .then(response => console.log("Sent:", command))
      .catch(error => console.log("Error:", error));
  }
</script>