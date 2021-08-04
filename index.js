const net = require('net');
const initDb = require('./db/initialize');
const connectToDiscord = require('./discord-client.js');

initDb().then(connectToDiscord);

const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('server bound');
});
