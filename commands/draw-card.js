const { MessageEmbed } = require('discord.js');
const db = require('../db');

module.exports = {
  name: 'draw-card',
  description: 'draws a card from a deck',
  options: [
    {
      name: 'deck',
      description: 'the name of the deck',
      type: 'STRING',
      required: true,
    },
  ],
  execute(interaction) {
    const deckName = interaction.options.getString('deck');
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    if (!deckName) {
      return interaction.reply('must select a deck');
    }
    return db
      .drawCard(interaction.guildId, deckName)
      .then((res) => {
        if (!res.rows.length) return 'deck empty!';
        return {
          embeds: [
            new MessageEmbed()
              .setTitle(res.rows[0].name)
              .setDescription(res.rows[0].body),
          ],
        };
      })
      .then((message) => interaction.reply(message));
  },
};
