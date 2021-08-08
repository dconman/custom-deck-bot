const db = require('../db');

module.exports = {
  name: 'reset-deck',
  description: 'reshuffles all drawn cards back into a deck',
  options: [
    {
      name: 'name',
      description: 'the name of the deck to show',
      type: 'STRING',
      required: true,
    },
  ],
  execute(interaction) {
    const name = interaction.options.getString('name');
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    if (!name) {
      return interaction.reply('must provide a name');
    }
    return db
      .resetDeck(interaction.guildId, name)
      .then(interaction.reply('deck reset!'));
  },
};
