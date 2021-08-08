const client = require('.');
const commands = require('../commands');

async function deployCommands(guildId) {
  return (
    process.env.TEST_MODE
      ? Promise.resolve(
          client.guilds.cache.get(guildId || process.env.DEV_GUILD)
        )
      : client.application?.fetch()
  )?.then((target) => target?.commands.set(commands));
}

module.exports = async function () {
  var promiseResolve;
  const readyPromise = new Promise((resolve, _reject) => {
    promiseResolve = resolve;
  });
  client.once('ready', () => {
    console.log('discord client ready');

    if (process.env.TEST_MODE) {
      client.channels
        .fetch(process.env.DEV_CHANNEL)
        .then((channel) =>
          channel
            .send('build complete!')
            .then(() => deployCommands())
            .then(() => channel.send('deploy complete!'))
        )
        .catch((e) => console.error(e.stack));
    }
    promiseResolve('Ready!');
  });

  client.on('messageCreate', async (message) => {
    if (message.content != '!deploy') return;
    console.log('deploy recieved');
    return deployCommands(message.guild.id)
      .then(() => message.channel.send('deploy successful'))
      .catch((e) => console.error(e.stack));
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log(interaction);
    if (!commands.has(interaction.commandName)) return;

    return commands
      .get(interaction.commandName)
      .execute(interaction)
      .catch((e) => {
        console.error(e.stack);
        interaction.reply({
          content: process.env.TEST_MODE ? e.stack : 'oops, there was an issue',
          ephemeral: !process.env.TEST_MODE,
        });
      });
  });

  console.log('logging in');
  client.login(process.env.DISCORD_TOKEN);
  return readyPromise;
};
