const db = require('../../db');

module.exports = {
  name: 'delete-deck',
  description: 'Deletes a deck from the server',
  type: 'SUB_COMMAND',
  options: [
    {
      name: 'name',
      description: 'the name of the deck to create',
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
      .deleteDeck(interaction.guildId, name)
      .then((res) => {
        if (!res.rows.length)
          return { content: 'Deck delete error', ephemeral: true };
        return `Deck ${res.rows[0].name} deleted!`;
      })
      .then((message) => interaction.reply(message));
  },
};
