const { MessageEmbed } = require('discord.js');
const db = require('../../db');

module.exports = {
  name: 'add-card',
  description: 'adds a card to a deck',
  type: 'SUB_COMMAND',
  options: [
    {
      name: 'deck',
      description: 'the name of the deck',
      type: 'STRING',
      required: true,
    },
    {
      name: 'name',
      description: 'the name of the card',
      type: 'STRING',
      required: true,
    },
    {
      name: 'body',
      description: 'the content of the card',
      type: 'STRING',
      required: false,
    },
  ],
  execute(interaction) {
    const deckName = interaction.options.getString('deck');
    const cardName = interaction.options.getString('name');
    const cardBody = interaction.options.getString('body') || '';
    if (!interaction.guildId) {
      return interaction.reply('must be used in server');
    }
    if (!deckName) {
      return interaction.reply('must select a deck');
    }
    if (!cardName) {
      return interaction.reply('must provide a card name');
    }
    return db
      .addCard(interaction.guildId, deckName, cardName, cardBody)
      .then((res) => {
        if (!res.rows.length)
          return { content: 'Card add error', ephemeral: true };
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
