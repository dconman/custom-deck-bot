const db = require('../../db');

module.exports = {
  name: 'show-deck',
  description: 'lists the cards in a deck',
  type: 'SUB_COMMAND',
  options: [
    {
      name: 'name',
      description: 'the name of the deck to show',
      type: 'STRING',
      required: true,
    },
    {
      name: 'cards',
      description: 'the name of the deck to show, defaults to all',
      type: 'STRING',
      required: false,
      choices: [
        {
          name: 'All(default)',
          value: 'all',
        },
        {
          name: 'Remaining',
          value: 'undrawn',
        },
        {
          name: 'Drawn',
          value: 'drawn',
        },
      ],
    },
  ],
  execute(interaction) {
    const name = interaction.options.getString('name');
    var drawn;
    switch (interaction.options.getString('cards')) {
      case 'drawn':
        drawn = true;
        break;
      case 'undrawn':
        drawn = false;
        break;
      default:
        drawn = undefined;
        break;
    }
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    if (!name) {
      return interaction.reply('must provide a name');
    }
    return db
      .listDeckCards(interaction.guildId, name, drawn)
      .then((res) =>
        interaction.reply(
          res.rows.map((row) => row.name).join('\n') || 'No cards yet!'
        )
      );
  },
};
