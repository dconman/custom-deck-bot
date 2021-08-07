const Snowflake = require('../snowflake');
const db = require('../db');

module.exports = {
  name: 'list-decks',
  description: 'lists all decks on a server',
  execute(interaction) {
    const guildId = Snowflake.fromSnowflake(interaction.guildId);
    return db
      .q('select * from decks where guild_id = $1::bigint', [guildId])
      .then(
        (res) => interaction.reply(res.rows.map((row) => row.name).join('\n') || 'No decks yet!')
      );
  },
};
