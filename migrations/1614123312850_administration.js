exports.up = pgm => {
    pgm.sql`
        
        create table clients(
            id_client serial primary key,
            name varchar(64) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table entitys(
            id_entity serial primary key,
            name varchar(64) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table currencys(
            id_currency serial primary key,
            name_singular varchar(32) not null,
            name_plural varchar(32),
            symbol varchar(5),
            code varchar(5)
        );

        create table odts(
            id_odt serial primary key,
            id_client int REFERENCES clients (id_client) ON UPDATE CASCADE,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE,
            id_entity int REFERENCES entitys (id_entity) ON UPDATE CASCADE,
            amount decimal(30,10) default 0 constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );
        `
};
exports.down = pgm => {
    pgm.sql`
        drop table odts;
        drop table currencys;
        drop table entitys;
        drop table clients;
        ` 
};
