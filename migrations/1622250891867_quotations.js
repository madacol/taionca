exports.up = pgm => {
    pgm.sql`

        create table quotations (
            id_quotation serial primary key,
            id_client int REFERENCES clients (id_client) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE,
            admin_percent decimal(5,5) constraint positive_admin_percent check (admin_percent > 0 AND admin_percent < 0.5) not null,
            description varchar(512) not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        alter table odts
        add column id_quotation int REFERENCES quotations (id_quotation) ON UPDATE CASCADE ON DELETE CASCADE;

        create table quotation_general_expenses(
            id_quotation_general_expense serial primary key,
            id_currency int REFERENCES currencys (id_currency) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_quotation int REFERENCES quotations (id_quotation) ON UPDATE CASCADE  ON DELETE CASCADE,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            rate decimal(30,10) constraint positive_rate check (rate >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table quotation_spendable_inv_expenses(
            id_quotation_spendable_inv_expense serial primary key,
            id_spendable_item int REFERENCES spendable_items (id_spendable_item) ON UPDATE CASCADE ON DELETE CASCADE,
            id_quotation int REFERENCES quotations (id_quotation) ON UPDATE CASCADE  ON DELETE CASCADE,
            quantity decimal(30,10) constraint positive_quantity check (quantity >= 0) not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            rate decimal(30,10) constraint positive_rate check (rate >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        create table quotation_no_spendable_inv_expenses(
            id_quotation_no_spendable_inv_expense serial primary key,
            id_no_spendable_item int REFERENCES no_spendable_items (id_no_spendable_item) ON UPDATE CASCADE ON DELETE CASCADE,
            id_quotation int REFERENCES quotations (id_quotation) ON UPDATE CASCADE  ON DELETE CASCADE,
            quantity decimal(30,10) constraint positive_quantity check (quantity >= 0) not null,
            amount decimal(30,10) constraint positive_amount check (amount >= 0) not null,
            description varchar(512) not null,
            rate decimal(30,10) constraint positive_rate check (rate >= 0) not null,
            created_at timestamp with time zone default current_timestamp
        );

        
    
        CREATE FUNCTION create_quotation (
            v_id_user integer,
            v_general_expenses json,
            v_spendable_expenses json,
            v_no_spendable_expenses json,
            v_id_currency integer,
            v_id_client integer,
            v_admin_percent decimal(5,5),
            v_description varchar(512),
            v_amount decimal(30,10)
        ) RETURNS integer
        LANGUAGE plpgsql
        AS $body$
        DECLARE
            new_quotation quotations%ROWTYPE;
        BEGIN
            
            
            INSERT INTO public.quotations ( id_client, id_user, id_currency, admin_percent, description, amount )
            VALUES ( v_id_client, v_id_user, v_id_currency, v_admin_percent, v_description, v_amount)
            RETURNING id_quotation INTO new_quotation;

            INSERT INTO quotation_general_expenses (id_quotation, id_currency, amount, description, rate)
            SELECT new_quotation.id_quotation, (currency->>'id_currency')::integer, amount, description, rate
            FROM json_to_recordset(v_general_expenses) AS x(
                "currency" json,
                "amount" decimal(30,10),
                "description" varchar(512),
                "rate" decimal(30,10)
            );

            INSERT INTO quotation_spendable_inv_expenses (id_quotation, id_spendable_item, quantity, amount, description, rate)
            SELECT new_quotation.id_quotation, (item->>'id_spendable_item')::integer, quantity, amount, description, rate
            FROM json_to_recordset(v_spendable_expenses) AS x(
                "item" json,
                "quantity" decimal(30,10),
                "amount" decimal(30,10),
                "description" varchar(512),
                "rate" decimal(30,10)
            );

            INSERT INTO quotation_no_spendable_inv_expenses (id_quotation, id_no_spendable_item, quantity, amount, description, rate)
            SELECT new_quotation.id_quotation, (item->>'id_no_spendable_item')::integer, quantity, amount, description, rate
            FROM json_to_recordset(v_no_spendable_expenses) AS x(
                "item" json,
                "quantity" decimal(30,10),
                "amount" decimal(30,10),
                "description" varchar(512),
                "rate" decimal(30,10)
            );
        
            RETURN new_quotation.id_quotation;
        END;
        $body$;
        `
};
exports.down = pgm => {
    pgm.sql`
            drop function if exists create_quotation;
            drop table if exists quotation_no_spendable_inv_expenses;
            drop table if exists quotation_spendable_inv_expenses;
            drop table if exists quotation_general_expenses;
            alter table odts drop column id_quotation;
            drop table if exists quotations;
        ` 
};
