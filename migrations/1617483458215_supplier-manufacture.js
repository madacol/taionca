exports.up = pgm => {
    pgm.sql`
        
        create table suppliers(
            id_supplier serial primary key,
            name varchar(64) not null,
            phone_number1 varchar(20),
            phone_number2 varchar(20),
            email varchar(64),
            address varchar(128),
            description varchar(512),
            created_at timestamp with time zone default current_timestamp
        );

        alter table spendable_items
            add column id_supplier int REFERENCES suppliers (id_supplier) ON UPDATE CASCADE ON DELETE CASCADE not null;

        alter table no_spendable_items
            add column id_supplier int REFERENCES suppliers (id_supplier) ON UPDATE CASCADE ON DELETE CASCADE not null;

        alter table spendable_products
            add column manufacture varchar(1024);

        alter table no_spendable_products
            add column manufacture varchar(1024);
        `
};
exports.down = pgm => {
    pgm.sql`
            alter table spendable_items drop column id_supplier;
            alter table no_spendable_items drop column id_supplier;
            drop table if exists suppliers;
        ` 
};
