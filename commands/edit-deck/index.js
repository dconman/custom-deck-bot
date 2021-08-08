const { requireCurrentDir } = require('../../utils');
const { Collection } = require('discord.js');

const subcommands = new Collection(
  requireCurrentDir(module).map((command) => [command.name, command])
);

module.exports = {
  name: 'edit-deck',
  description: 'Add or remove cards from a deck',
  options: subcommands,
  execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    return subcommands.get(subcommand).execute(interaction);
  },
};
