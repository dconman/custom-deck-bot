process.env.TEST_MODE = Boolean(process.env.TEST_MODE);
const net = require('net');
const initDb = require('./db/initialize');
const connectToDiscord = require('./discord-client/initialize');

initDb()
  .then(() => connectToDiscord())
  .catch((e) => console.error(e.stack));
