const net = require('net');
const initDb = require('./db/initialize');
const connectToDiscord = require('./discord-client/initialize');

initDb()
  .then(() => connectToDiscord())
  .catch((e) => console.error(e.stack));

const server = net.createServer();
server.on('error', (err) => {
  throw err;
});
server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('server bound');
});
