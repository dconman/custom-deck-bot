create table decks (
    id serial not null primary key,
    guild_id bigint not null,
    name text not null
)