const db = require('../db');

module.exports = {
  name: 'show-deck',
  description: 'lists the cards in a deck',
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
      .listDeckCards(interaction.guildId, name)
      .then((res) =>
        interaction.reply(
          res.rows.map((row) => row.name).join('\n') || 'No cards yet!'
        )
      );
  },
};
