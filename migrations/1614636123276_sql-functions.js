exports.up = pgm => {
    pgm.sql`
    
    CREATE FUNCTION auto_select_balance (
        v_id_entity integer,
        amount decimal(30,10),
        v_id_currency integer
    ) RETURNS integer
    LANGUAGE plpgsql
    AS $body$
    DECLARE
        v_id_balance integer;
    BEGIN
        SELECT id_balance INTO v_id_balance
            FROM public.balances
            JOIN accounts USING (id_account)
            WHERE balance >= amount
                AND id_entity = v_id_entity
                AND id_currency = v_id_currency
            LIMIT 1
        ;
        RETURN v_id_balance;
    END;
    $body$;

    CREATE FUNCTION alter_balance (
        v_id_balance integer,
        amount decimal(30,10),
        id_movement_category integer,
        v_type_movement_category movement_category
    ) RETURNS balance_movements
    LANGUAGE plpgsql
    AS $body$
    DECLARE
        v_balance_movements balance_movements;
    BEGIN
        WITH _t as (
            UPDATE public.balances
                SET balance = balance + amount
                WHERE id_balance = v_id_balance
        )
        INSERT INTO public.balance_movements
            ( id_balance, amount, id_movement_category, type_movement_category )
            VALUES (v_id_balance, amount, id_movement_category, v_type_movement_category)
            RETURNING * INTO v_balance_movements
        ;

        RETURN v_balance_movements;
    END;
    $body$;
    `

};

exports.down = pgm => {
    pgm.sql`
    
    DROP FUNCTION IF EXISTS spendable_inv_odt_expenses;
    DROP FUNCTION IF EXISTS alter_balance;
    DROP FUNCTION IF EXISTS auto_select_balance;
    
    `
};
