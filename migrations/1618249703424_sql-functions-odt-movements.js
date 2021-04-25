exports.up = pgm => {
    pgm.sql`
    
    CREATE FUNCTION get_odt_movement (
        v_id_movement_category integer,
        v_type_movement_category movement_category
    ) RETURNS integer
    LANGUAGE plpgsql
    AS $body$
    DECLARE
        v_id_odt integer;
    BEGIN

        CASE v_type_movement_category
            WHEN 'general_expenses' THEN
                SELECT id_odt INTO v_id_odt
                FROM general_expenses
                -- JOIN odts USING (id_odt)
                WHERE id_general_expense = v_id_movement_category;
            WHEN 'spendable_inv_odt_expenses' THEN
                SELECT id_odt INTO v_id_odt
                FROM spendable_inv_odt_expenses
                -- JOIN odts USING (id_odt)
                WHERE id_spendable_inv_odt_expense = v_id_movement_category;
            WHEN 'no_spendable_inv_odt_expenses' THEN
                SELECT id_odt INTO v_id_odt
                FROM no_spendable_inv_odt_expenses
                -- JOIN odts USING (id_odt)
                WHERE id_no_spendable_inv_odt_expense = v_id_movement_category;
            ELSE
                RETURN 0;
        END CASE;

        RETURN v_id_odt;

    END;
    $body$;
    `

};

exports.down = pgm => {
    pgm.sql`
    DROP FUNCTION IF EXISTS get_odt_movement;
    
    `
};
