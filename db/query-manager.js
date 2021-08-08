function selectList(columns, table, sep = ', ') {
  return columns.map((column) => table + '.' + column).join(sep);
}

const DECK_FEILDS = ['"id"', '"name"', '"guild_id_sf"'];
const LIST_DECKS_QUERY = `
select ${selectList(DECK_FEILDS, '"decks"')}
from "decks" where "decks"."guild_id_sf" = $1::bigint
`.trim();

const ADD_DECK_QUERY = `
insert into "decks" ("guild_id_sf", "name")
values ($1::bigint, $2::text)
returning ${selectList(DECK_FEILDS, '"decks"')}
`.trim();

const DELETE_DECK_QUERY = `
delete from "decks"
where "decks"."guild_id_sf" = $1::bigint and "decks"."name" = $2::text
returning ${selectList(DECK_FEILDS, '"decks"')}
`.trim();

const CARD_FIELDS = ['"id"', '"name"', '"deck_id"', '"body"', '"drawn"'];
function filterByDrawn(pos) {
  return `and "cards"."drawn" = $${pos}::boolean`;
}

const LIST_DECK_CARDS_QUERY = `
select ${selectList(CARD_FIELDS, '"cards')}
from "cards"
inner join "decks"
  on "cards"."deck_id" = "decks"."id"
where "decks"."guild_id_sf" = $1::bigint and "decks"."name" = $2::text
`.trim();
const LIST_DECK_CARDS_ADVANCED_QUERY = LIST_DECK_CARDS_QUERY + filterByDrawn(3);

const SHOW_DECK_CARD_QUERY = `
select ${selectList(CARD_FIELDS, '"cards')}
from "cards"
inner join "decks"
  on "cards"."deck_id" = "decks"."id"
where "decks"."guild_id_sf" = $1::bigint
  and "decks"."name" = $2::text
  and "cards"."name" = $3::text
`.trim();

const ADD_DECK_CARD_QUERY = `
insert into "cards" ("deck_id", "name", "body")
select "decks"."id", $3::text, $4::text
from "decks" where "decks"."guild_id_sf" = $1::binint and "decks"."name" = $2::text
returning ${selectList(CARD_FIELDS, '"cards"')}
`.trim();

const DELETE_DECK_CARD_QUERY = `
delete from "cards"
using "decks"
where "cards"."deck_id" = "decks"."id"
  and "decks"."guild_id_sf" = $1::binint
  and "decks"."name" = $2::text
  and "cards"."name" = $3::text
returning ${selectList(CARD_FIELDS, '"cards"')}
`.trim();

const DRAW_DECK_CARD_QUERY = `
update "cards"
set "drawn" = TRUE
where "cards"."id" = (
  select c2."id" from "cards" c2
  inner join "decks"
    on c2."deck_id" = "decks".id 
  where "decks"."guild_id_sf" = $1::binint
    and "decks"."name" = $2::text
    and c2"drawn" = FALSE
  order by random()
  limit 1
) returning ${selectList(CARD_FIELDS, '"cards"')}
`.trim();

const RESET_DECK_QUERY = `
update "cards" set "drawn" = FALSE
using "decks"
where "cards"."deck_id" = "decks"."id"
  and "decks"."guild_id_sf" = $1::binint
  and "decks"."name" = $2::text
returning ${selectList(CARD_FIELDS, '"cards"')}
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

  async listDeckCards(guildId, deckName, drawn) {
    if (drawn === undefined)
      return this.query(LIST_DECK_CARDS_QUERY, [
        this.snowflakeFromDiscord(guildId),
        deckName,
      ]);
    return this.query(LIST_DECK_CARDS_ADVANCED_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
    ]);
  }

  async addCard(guildId, deckName, cardName, cardBody) {
    return this.query(ADD_DECK_CARD_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
      cardName,
      cardBody,
    ]);
  }

  async deleteCard(guildId, deckName, cardName) {
    return this.query(DELETE_DECK_CARD_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
      cardName,
    ]);
  }

  async drawCard(guildId, deckName) {
    return this.query(DRAW_DECK_CARD_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
    ]);
  }

  async showCard(guildId, deckName, cardName) {
    return this.query(SHOW_DECK_CARD_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
      cardName,
    ]);
  }

  async resetDeck(guildId, deckName) {
    return this.query(RESET_DECK_QUERY, [
      this.snowflakeFromDiscord(guildId),
      deckName,
    ]);
  }
};
