const Snowflake = require('../snowflake.js');
module.exports = {
    command: 'list-decks',
    description: 'lists all decks on a server',
    execute(db, msg, _args) {
        const guildId = Snowflake.fromDiscord(msg.guild);
        db.query('select * from decks where guild_id = $1::bigint', [guildId])
          .then( res => {
                const response = res.rows.map(row => row.name).join('\n');
                msg.channel.send(response || "No decks yet!");
          });
    }
};
