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
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE,
            min_stock decimal(30,10) not null,
            mid_stock decimal(30,10) not null,
            max_stock decimal(30,10) not null,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );


        create table spendable_items(
            id_spendable_item serial primary key,
            id_brand int REFERENCES brands (id_brand) ON UPDATE CASCADE ON DELETE CASCADE,
            id_spendable_product int REFERENCES spendable_products (id_spendable_product) ON UPDATE CASCADE ON DELETE CASCADE,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table no_spendable_products(
            id_no_spendable_product serial primary key,
            code varchar(32) unique not null,
            id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE,
            min_stock decimal(30,10) not null,
            mid_stock decimal(30,10) not null,
            max_stock decimal(30,10) not null,
            description varchar(512) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table no_spendable_items(
            id_no_spendable_item serial primary key,
            id_brand int REFERENCES brands (id_brand) ON UPDATE CASCADE ON DELETE CASCADE,
            id_no_spendable_product int REFERENCES no_spendable_products (id_no_spendable_product) ON UPDATE CASCADE ON DELETE CASCADE,
            cost decimal(30,10) not null,
            price decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table spendable_stocks(
            id_spendable_stock serial primary key,
            id_spendable_item int REFERENCES spendable_items (id_spendable_item) ON UPDATE CASCADE ON DELETE CASCADE,
            id_storage int REFERENCES storages (id_storage) ON UPDATE CASCADE ON DELETE CASCADE,
            amount decimal(30,10) default 0 constraint positive_amount check (amount >= 0) not null,
            created_at timestamp with time zone default current_timestamp,
            unique (id_spendable_item, id_storage)
        );


        create table no_spendable_stocks(
            id_no_spendable_stock serial primary key,
            id_no_spendable_item int REFERENCES no_spendable_items (id_no_spendable_item) ON UPDATE CASCADE ON DELETE CASCADE,
            id_storage int REFERENCES storages (id_storage) ON UPDATE CASCADE ON DELETE CASCADE,
            amount decimal(30,10) default 0 constraint positive_amount check (amount >= 0) not null,
            created_at timestamp with time zone default current_timestamp,
            unique (id_no_spendable_item, id_storage)
        );

        create table spendable_inv_odt_expenses(
            id_spendable_inv_odt_expense serial primary key,
            id_spendable_stock int REFERENCES spendable_stocks (id_spendable_stock) ON UPDATE CASCADE ON DELETE CASCADE,
            id_odt integer not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            rate decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table no_spendable_inv_odt_expenses(
            id_no_spendable_inv_odt_expense serial primary key,
            id_no_spendable_stock int REFERENCES no_spendable_stocks (id_no_spendable_stock) ON UPDATE CASCADE ON DELETE CASCADE,
            id_odt integer not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            rate decimal(30,10) not null,
            created_at timestamp with time zone default current_timestamp
        );

        `
};
exports.down = pgm => {
    pgm.sql`
        drop table if exists no_spendable_inv_odt_expenses;
        drop table if exists spendable_inv_odt_expenses;
        drop table if exists no_spendable_stocks;
        drop table if exists spendable_stocks;
        drop table if exists no_spendable_items;
        drop table if exists no_spendable_products;
        drop table if exists spendable_items;
        drop table if exists spendable_products;
        drop table if exists brands;
        drop table if exists storages;
        drop table if exists measures;
        ` 
};
