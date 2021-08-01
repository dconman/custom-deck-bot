
const Discord = require('discord.js');
const commands = require('./commands');
const prefix = '!';

module.exports = async function(dbClient) {
    console.log('creating discord client');
    const client = new Discord.Client();

    client.once('ready', () => {
        console.log('discord client ready');
    });

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        console.log(message);
    
        const args = message.content.slice(prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();
    
        const receipe = commands.find(cmd => cmd.command === command)

        if (receipe) { receipe.execute(dbClient, message, args); }
    
    });


    console.log('logging in')
    client.login(process.env.DISCORD_TOKEN);
};
