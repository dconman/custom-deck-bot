const Snowflake = require('../snowflake.js');
module.exports = {
    command: 'delete-deck',
    description: '**name** removes the named deck from a server',
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
        db.query('delete from decks where guild_id = $1::bigint and name = $2::text', [guildId, name])
          .then( res => {
                msg.channel.send(`deleted ${res.rowCount} decks`);
          });
    }
};
