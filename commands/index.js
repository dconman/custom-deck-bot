const { requireCurrentDir } = require('../utils');
const { Collection } = require('discord.js');

exports.commands = new Collection(
  requireCurrentDir(module).map((command) => [command.name, command])
);

module.exports.handleInteractionCreate = async (interaction) => {
  if (!interaction.isCommand()) return;
  console.log(interaction);
  if (!exports.commands.has(interaction.commandName)) return;

  return exports.commands
    .get(interaction.commandName)
    .execute(interaction)
    .catch((e) => {
      console.error(e.stack);
      interaction.reply({
        content: process.env.TEST_MODE ? e.stack : 'oops, there was an issue',
        ephemeral: !process.env.TEST_MODE,
      });
    });
};
