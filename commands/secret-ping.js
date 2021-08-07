module.exports = {
  name: 'secret-ping',
  description: 'test that this bot is listening',
  async execute(interaction) {
    return interaction.reply({ content: 'PONG!', ephemeral: true });
  },
};
