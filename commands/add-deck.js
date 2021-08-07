const Snowflake = require('../snowflake');
const db = require('../db');

module.exports = {
  name: 'add-deck',
  description: 'Creates a new deck on a server',
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
      .q(
        'insert into decks (guild_id, name) values ($1::bigint, $2::text)',
        [guildId, name]
      )
      .then((res) => interaction.reply(`added ${res.rowCount} decks`));
  },
};
