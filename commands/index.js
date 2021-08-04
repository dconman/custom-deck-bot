const { Collection } = require('discord.js');

module.exports = new Collection(
  [
    require('./ping.js'),
    require('./list-decks.js'),
    require('./add-deck.js'),
    require('./delete-deck.js'),
  ].map((command) => [command.name, command])
);
