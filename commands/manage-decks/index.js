const { requireCurrentDir } = require('../../utils');
const { Collection } = require('discord.js');

const subcommands = new Collection(
  requireCurrentDir(module).map((command) => [command.name, command])
);

module.exports = {
  name: 'manage-decks',
  description: 'Add or remove decks',
  options: subcommands,
  execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    return subcommands.get(subcommand).execute(interaction);
  },
};
