const LIST_DECKS_QUERY = 'select * from decks where guildId = $1::bigint';

const ADD_DECK_QUERY = `
insert into decks (guildId, name)
values ($1::bigint, $2::text)
`.trim();

const DELETE_DECK_QUERY =
  'delete from decks where guildId = $1::bigint and name = $2::text';

const LIST_CARDS_QUERY = 'select * from cards where deckId = $1::integer';
const LIST_CARDS_ADVANCED_QUERY = LIST_CARDS_QUERY + 'and drawn = $2::boolean';

const ADD_CARD_QUERY = `
insert into cards (deckId, name, body)
values ($1::integer, $2::text, $3::text)
`.trim();

const DELETE_CARD_QUERY = `
delete from cards
where deckId = $1::integer and name = $2::text
`.trim();

const DRAW_CARD_QUERY = `
update cards
set drawn = TRUE
where id = (
  select id from cards
  where deckId = $1::integer and drawn = FALSE
  order by random()
  limit 1
) returning *
`.trim();

const RESET_DECK_QUERY =
  'update cards set drawn = FALSE where deckId = $1::integer';

module.exports = class QueryManager {
  constructor(pool, client) {
    this.pool = pool;
    this.client = client || pool;
  }

  async query(...args) {
    console.log(args);
    return this.client.query(args);
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
    return this.query(LIST_DECKS_QUERY, [guildId]);
  }

  async addDeck(guildId, name) {
    return this.query(ADD_DECK_QUERY, [guildId, name]);
  }

  async deleteDeck(guildId, name) {
    return this.query(DELETE_DECK_QUERY, [guildId, name]);
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
