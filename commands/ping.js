module.exports = {
    command: 'ping',
    description: 'test that this bot is listening',
    execute(_db, msg, _args) {
        msg.channel.send('PONG!');
    }
};
