Mqtt test

<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>

<script>

const clientId = 'mqttjs_' + Math.random();

const host = 'ws://localhost:8083/mqtt';

const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  username:"superuser",
  password: "superuser",
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
}

console.log('Connecting mqtt client');

const client = mqtt.connect(host, options);

client.on('connect', () => {
    console.log("SUCCESS!!!!")
});

client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
});

client.on('reconnect', () => {
  console.log('Reconnecting...')
});
</script>