create table cards (
    id serial not null primary key,
    deck_id integer not null references decks on delete cascade on update cascade,
    name text,
    body text
)