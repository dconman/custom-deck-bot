const { Client, Intents } = require('discord.js');

console.log('creating discord client');
module.exports = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
