const fs = require('fs');
const { Collection } = require('discord.js');

const commands = fs
  .readdirSync(__dirname)
  .filter((file) => !__filename.endsWith(file))
  .map((file) => require('./' + file))
  .map((command) => [command.name, command]);

module.exports = new Collection(commands);
