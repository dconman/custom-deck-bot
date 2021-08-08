const db = require('../db');

module.exports = {
  name: 'delete-card',
  description: 'deletes a card from a deck',
  options: [
    {
      name: 'deck',
      description: 'the name of the deck',
      type: 'STRING',
      required: true,
    },
    {
      name: 'card',
      description: 'the name of the card',
      type: 'STRING',
      required: true,
    },
  ],
  execute(interaction) {
    const deckName = interaction.options.getString('deck');
    const cardName = interaction.options.getString('card');
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    if (!deckName) {
      return interaction.reply('must select a deck');
    }
    if (!cardName) {
      return interaction.reply('must select a card');
    }
    return db
      .deleteCard(interaction.guildId, deckName, cardName)
      .then((res) => {
        if (!res.rows.length)
          return { content: 'Card delete error', ephemeral: true };
        return res.rows[0].name + ' deleted!';
      })
      .then((message) => interaction.reply(message));
  },
};
