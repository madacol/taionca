exports.up = pgm => {
    pgm.sql`

        alter table general_expenses
        add column id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE;

        alter table general_expenses
        add column quantity decimal(30,10) default 1 constraint positive_quantity check (quantity >= 0) NOT NULL;

        alter table quotation_general_expenses
        add column id_measure int REFERENCES measures (id_measure) ON UPDATE CASCADE ON DELETE CASCADE;

        alter table quotation_general_expenses
        add column quantity decimal(30,10) default 1 constraint positive_quantity check (quantity >= 0) NOT NULL;

        drop function if exists create_quotation;
        CREATE FUNCTION new_create_quotation (
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

            INSERT INTO quotation_general_expenses (id_quotation, id_currency, amount, description, rate, id_measure, quantity)
            SELECT new_quotation.id_quotation, (currency->>'id_currency')::integer, amount, description, rate, (measure->>'value')::integer, quantity
            FROM json_to_recordset(v_general_expenses) AS x(
                "currency" json,
                "amount" decimal(30,10),
                "description" varchar(512),
                "rate" decimal(30,10),
                "measure" json,
                "quantity" decimal(30,10)
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
            drop function if exists new_create_quotation;
            alter table quotation_general_expenses drop column id_measure;
            alter table quotation_general_expenses drop column quantity;
            alter table general_expenses drop column id_measure;
            alter table general_expenses drop column quantity;
        ` 
};
