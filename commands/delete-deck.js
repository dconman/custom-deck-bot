const Snowflake = require('../utils/snowflake');
const db = require('../db');

module.exports = {
  name: 'delete-deck',
  description: 'Deletes a deck from the server',
  options: [
    {
      name: 'name',
      description: 'the name of the deck to create',
      type: 'STRING',
      required: true,
    },
  ],
  execute(interaction) {
    const guildId = Snowflake.fromSnowflake(interaction.guildId);
    const name = interaction.options.getString('name');
    if (!guildId) {
      return interaction.reply('must be used in server');
    }
    if (!name) {
      return interaction.reply('must provide a name');
    }
    return db
      .deleteDeck(guildId, name)
      .then((res) => interaction.reply(`deleted ${res.rowCount} decks`));
  },
};
