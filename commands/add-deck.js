const Snowflake = require('../snowflake.js');
module.exports = {
    command: 'add-deck',
    description: '**name** creates a new deck on a server with the given name',
    execute(db, msg, args) {
        const guildId = Snowflake.fromDiscord(msg.guild);
        const name = args[0];
        if(!guildId) {
            msg.channel.send('must be used in server');
            return
        }
        if(!name) {
            msg.channel.send('must provide a name')
            return
        }
        db.query('insert into decks (guild_id, name) values ($1::bigint, $2::text)', [guildId, name])
          .then( res => {
                msg.channel.send(`added ${res.rowCount} decks`);
          });
    }
};
