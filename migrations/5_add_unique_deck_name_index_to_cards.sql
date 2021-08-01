alter table cards alter column name set not null;

create unique index cards_deck_id_name_idx on cards
(deck_id, name);
