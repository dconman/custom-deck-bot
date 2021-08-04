const { Client, Intents } = require('discord.js');
//const commands = require('./commands');

module.exports = async function () {
  console.log('creating discord client');
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.once('ready', () => {
    console.log('discord client ready');

    if (process.env.TEST_MODE === 'true') {
      client.channels
        .fetch('871426528817348658')
        .then((channel) => channel.send('build complete!'));
    }
  });

  client.on('messageCreate', async (message) => {
    if (message.content != '!deploy') return;
    if (!client.application?.owner) await client.application?.fetch();

    const data = [
      {
        name: 'ping',
        description: 'Replies with Pong!',
      },
    ];

    return (
      process.env.TEST_MODE === 'true'
        ? client.guilds.cache.get(message.guild.id)
        : client.application
    )?.commands.create(data);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });

  console.log('logging in');
  return client.login(process.env.DISCORD_TOKEN);
};
