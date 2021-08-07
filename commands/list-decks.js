const db = require('../db');

module.exports = {
  name: 'list-decks',
  description: 'lists all decks on a server',
  execute(interaction) {
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    return db
      .listDecks(interaction.guildId)
      .then((res) =>
        interaction.reply(
          res.rows.map((row) => row.name).join('\n') || 'No decks yet!'
        )
      );
  },
};
