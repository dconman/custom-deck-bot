const commands = [
    require('./ping.js'),
    require('./list-decks.js'),
    require('./add-deck.js'),
    require('./delete-deck.js')
]


commands.push({
    command: 'help',
    description: 'this help text',
    execute(_db, msg, _args) {
        const text = commands.map( cmd => `\`${cmd.command}\`\t${cmd.description}` ).join("\n");
        msg.channel.send(text)
    }
})

module.exports = commands;
