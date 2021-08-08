const { MessageEmbed } = require('discord.js');
const db = require('../../db');

module.exports = {
  name: 'show-card',
  description: 'shows a card from a deck',
  type: 'SUB_COMMAND',
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
      .showCard(interaction.guildId, deckName, cardName)
      .then((res) => {
        if (!res.rows.length)
          return { content: 'Card not found', ephemeral: true };
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
