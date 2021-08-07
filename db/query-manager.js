const DECK_FEILDS = 'id, name, guild_id_sf';
const LIST_DECKS_QUERY = `
select ${DECK_FEILDS} from decks where guild_id_sf = $1::bigint
`.trim();

const ADD_DECK_QUERY = `
insert into decks (guild_id_sf, name)
values ($1::bigint, $2::text)
returning ${DECK_FEILDS}
`.trim();

const DELETE_DECK_QUERY = `
delete from decks
where guild_id_sf = $1::bigint and name = $2::text
returning ${DECK_FEILDS}
`.trim();

const CARD_FIELDS = 'id, name, deckId, body, drawn';

const LIST_CARDS_QUERY = `
select ${CARD_FIELDS} from cards where deckId = $1::integer
`.trim();
const LIST_CARDS_ADVANCED_QUERY = LIST_CARDS_QUERY + 'and drawn = $2::boolean';

const ADD_CARD_QUERY = `
insert into cards (deckId, name, body)
values ($1::integer, $2::text, $3::text)
returning ${CARD_FIELDS}
`.trim();

const DELETE_CARD_QUERY = `
delete from cards
where deckId = $1::integer and name = $2::text
returning ${CARD_FIELDS}
`.trim();

const DRAW_CARD_QUERY = `
update cards
set drawn = TRUE
where id = (
  select id from cards
  where deckId = $1::integer and drawn = FALSE
  order by random()
  limit 1
) returning ${CARD_FIELDS}
`.trim();

const RESET_DECK_QUERY = `
update cards set drawn = FALSE where deckId = $1::integer
returning ${CARD_FIELDS}
`.trim();

const SNOWFLAKE_MODIFIER = 9223372036854775808n;

module.exports = class QueryManager {
  constructor(pool, client) {
    this.pool = pool;
    this.client = client || pool;
    this.snowflakifyResults = this.snowflakifyResults.bind(this);
  }

  snowflakeFromDiscord(snowflake) {
    return (BigInt(snowflake) - SNOWFLAKE_MODIFIER).toString();
  }

  snowflakeFromPostgres(snowflake) {
    return (BigInt(snowflake) + SNOWFLAKE_MODIFIER).toString();
  }

  snowflakifyResults(results) {
    console.log(results);
    results.rows.map((row) => {
      Object.keys(row).forEach((key) => {
        if (!key.endsWith('_sf')) return;
        row[key.slice(0, -3)] = this.snowflakeFromPostgres(row[key]);
      });
    });
    return results;
  }

  async query(...args) {
    console.log(args);
    return this.client.query(...args).then(this.snowflakifyResults);
  }

  async inTransaction(toDo) {
    return (
      this.client ? Promise.resolve(this.client) : this.pool.connect()
    ).then((client) =>
      client.query('begin').then(() =>
        toDo(new QueryManager(this.pool, client))
          .then(() => client.query('commit'))
          .catch((e) => {
            client.query('rollback');
            throw e;
          })
          .finally(() => (!this.client ? client.release() : undefined))
      )
    );
  }

  async listDecks(guildId) {
    return this.query(LIST_DECKS_QUERY, [this.snowflakeFromDiscord(guildId)]);
  }

  async addDeck(guildId, name) {
    return this.query(ADD_DECK_QUERY, [
      this.snowflakeFromDiscord(guildId),
      name,
    ]);
  }

  async deleteDeck(guildId, name) {
    return this.query(DELETE_DECK_QUERY, [
      this.snowflakeFromDiscord(guildId),
      name,
    ]);
  }

  async listCards(deckId, drawn) {
    if (drawn === undefined) return this.query(LIST_CARDS_QUERY, [deckId]);
    return this.query(LIST_CARDS_ADVANCED_QUERY, [deckId, drawn]);
  }

  async addCard(deckId, cardName, cardBody) {
    return this.query(ADD_CARD_QUERY, [deckId, cardName, cardBody]);
  }

  async deleteCard(deckId, cardName) {
    return this.query(DELETE_CARD_QUERY, [deckId, cardName]);
  }

  async drawCard(deckId) {
    return this.query(DRAW_CARD_QUERY, [deckId]);
  }

  async resetDeck(deckId) {
    return this.query(RESET_DECK_QUERY, [deckId]);
  }
};
