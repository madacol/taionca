exports.up = pgm => {
    pgm.sql`
        
        create table measures(
            id_measure serial primary key,
            name varchar(32),
            unit varchar(16),
            created_at timestamp with time zone default current_timestamp
        );

        create table storages(
            id_storage serial primary key,
            name varchar(64) unique not null,            
            description varchar(512) not null,
            location varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table brands(
            id_brand serial primary key,
            name varchar(64) unique not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table spendable_products(
            id_spendable_product serial primary key,
            code varchar(32) unique not null,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT spendable_products_ukey UNIQUE (id_measure)
        );


        create table spendable_items(
            id_spendable_item serial primary key,
            id_brand int REFERENCES brands (id_brand) ON UPDATE CASCADE,
            id_spendable_product int REFERENCES spendable_products (id_spendable_product) ON UPDATE CASCADE,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT spendable_items_ukey UNIQUE (id_brand, id_spendable_product)
        );

        create table no_spendable_products(
            id_no_spendable_product serial primary key,
            code varchar(32) unique not null,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT no_spendable_products_ukey UNIQUE (id_measure)
        );

        create table no_spendable_items(
            id_no_spendable_item serial primary key,
            id_brand int REFERENCES brands (id_brand) ON UPDATE CASCADE,
            id_no_spendable_product int REFERENCES no_spendable_products (id_no_spendable_product) ON UPDATE CASCADE,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT no_spendable_items_ukey UNIQUE (id_brand, id_no_spendable_product)
        );

        create table spendable_stocks(
            id_spendable_stock serial primary key,
            id_spendable_item int REFERENCES spendable_items (id_spendable_item) ON UPDATE CASCADE,
            id_storage int REFERENCES storages (id_storage) ON UPDATE CASCADE,
            amount decimal(30,10) default 0 not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT spendable_stocks_ukey UNIQUE (id_spendable_item, id_storage)
        );


        create table no_spendable_stocks(
            id_no_spendable_stock serial primary key,
            id_no_spendable_item int REFERENCES no_spendable_items (id_no_spendable_item) ON UPDATE CASCADE,
            id_storage int REFERENCES storages (id_storage) ON UPDATE CASCADE,
            amount decimal(30,10) default 0 not null,
            created_at timestamp with time zone default current_timestamp,
            CONSTRAINT no_spendable_stocks_ukey UNIQUE (id_no_spendable_item, id_storage)
        );


        `
    
};
exports.down = pgm => {
    pgm.sql`

        drop table no_spendable_stocks;
        drop table spendable_stocks;
        drop table no_spendable_items;
        drop table no_spendable_products;
        drop table spendable_items;
        drop table spendable_products;
        drop table brands;
        drop table storages;
        drop table measures;
        ` 
};
