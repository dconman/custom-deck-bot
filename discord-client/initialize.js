const client = require('.');
const { commands, handleInteractionCreate } = require('../commands');

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

  client.on('interactionCreate', handleInteractionCreate);

  console.log('logging in');
  return client.login(process.env.DISCORD_TOKEN).then(readyPromise);
};
