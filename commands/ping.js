module.exports = {
  name: 'ping',
  description: 'test that this bot is listening',
  async execute(interaction) {
    return interaction.reply('PONG!');
  },
};
