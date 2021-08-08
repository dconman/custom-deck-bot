const { Collection } = require('discord.js');

module.exports = new Collection(
  [
    require('./ping'),
    require('./list-decks'),
    require('./add-deck'),
    require('./delete-deck'),
    require('./secret-ping'),
    require('./show-deck'),
    require('./show-card'),
  ].map((command) => [command.name, command])
);
