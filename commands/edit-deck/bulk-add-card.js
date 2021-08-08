const { MessageEmbed } = require('discord.js');
const db = require('../../db');

const RESPONSE =
  'Repsond to this message with the cards to add to this deck. The first line of each message will be the card name, the remainder will be the body (optional). Go ahead and lock the thread when you are done.';

function listenOnThread(thread, deckName) {
  const startListener = (message) => {
    if (message.channel.id !== thread.id || message.author?.bot !== false)
      return;
    const [cardName, body] = message.content.split(/\n(.*)/s);
    if (!cardName) {
      return 'must provide a card name';
    }
    return db
      .addCard(thread.guild.id, deckName, cardName, body)
      .then((res) => {
        if (!res.rows.length)
          return { content: 'Card add error', ephemeral: true };
        const embed = new MessageEmbed().setTitle(res.rows[0].name);
        if (res.rows[0].body) embed.setDescription(res.rows[0].body);
        return {
          embeds: [embed],
        };
      })
      .catch((e) => {
        if (e.code === '23505') return 'card already exists';
        throw e;
      })
      .then((response) => thread.send(response));
  };
  const endListener = async (oldThread, newThread) => {
    const modThread = newThread || oldThread;
    if (modThread.id !== thread.id) return;
    if (!modThread.deleted && !modThread.locked) return;
    thread.client
      .off('messageCreate', startListener)
      .off('threadUpdate', endListener)
      .off('threadDelete', endListener);
  };
  thread.client
    .on('messageCreate', startListener)
    .on('threadUpdate', endListener)
    .on('threadDelete', endListener);
}

module.exports = {
  name: 'bulk-add-card',
  description: 'quickly add cards to a deck',
  type: 'SUB_COMMAND',
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
    return db.getDeck(interaction.guildId, deckName).then((res) => {
      if (!res.rows.length)
        return interaction.reply('Unable to find ' + deckName);
      return interaction
        .reply({ content: RESPONSE, fetchReply: true })
        .then((message) =>
          message.startThread({
            name: deckName,
            autoArchiveDuration: 60,
            reason: 'bulk card add thread for ' + deckName,
          })
        )
        .then((thread) => listenOnThread(thread, deckName));
    });
  },
};
