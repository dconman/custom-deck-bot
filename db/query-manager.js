module.exports = class QueryManager {
  constructor(pool) {
    this.pool = pool;
  }

  async query(...args) {
    console.log(args);
    return this.pool.query(...args);
  }

  async addDeck(guild_id, name) {
    return this.query(
      'insert into decks (guild_id, name) values ($1::bigint, $2::text)',
      [guild_id, name]
    );
  }

  async deleteDeck(guild_id, name) {
    return this.query(
      'delete from decks where guild_id = $1::bigint and name = $2::text',
      [guild_id, name]
    );
  }

  async listDecks(guild_id) {
    return this.query('select * from decks where guild_id = $1::bigint', [
      guild_id,
    ]);
  }
};
