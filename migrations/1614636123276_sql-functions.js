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
        SELECT id_balance INTO STRICT v_id_balance
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
        UPDATE public.balances
            SET balance = balance + amount
            WHERE id_balance = v_id_balance;

        INSERT INTO public.balance_movements
            ( id_balance, amount, id_movement_category, type_movement_category )
            VALUES (v_id_balance, amount, id_movement_category, v_type_movement_category)
            RETURNING * INTO v_balance_movements;

        RETURN v_balance_movements;
    END;
    $body$;

    CREATE FUNCTION closure_odt (
        v_id_account integer,
        v_id_odt integer,
        v_id_user integer,
        v_amount decimal(30,10),
        admin_users json,
        operative_users json,
        supervisor_users json,
        admin_expense_percent decimal(5,5),
        president_profit_percent decimal(5,5)
    ) RETURNS text
    LANGUAGE plpgsql
    AS $body$
    DECLARE
        new_closure_odt closure_odts%ROWTYPE;
        -- new_admin_closure_odts admin_closure_odts%ROWTYPE;
        -- new_operative_closure_odts operative_closure_odts%ROWTYPE;
        -- new_supervisor_closure_odts supervisor_closure_odts%ROWTYPE;
        id_entity_taionca CONSTANT integer := 1;
        id_entity_admin CONSTANT integer := 2;
        id_entity_president integer := 4;
        general_expenses decimal(30,10);
        admin_entity_profit decimal(30,10);
        admin_profit_percent decimal(5,5);
        operative_profit_percent decimal(5,5);
        supervisor_profit_percent decimal(5,5);
        spendable_inv_odt_expenses decimal(30,10);
        no_spendable_inv_odt_expenses decimal(30,10);
        inv_expenses decimal(30,10);
        ganancia decimal(30,10);
        ganancia_personal_operativo decimal(30,10);
        ganancia_presidente decimal(30,10);
        ganancia_personal_administrativo decimal(30,10);
        ganancia_supervisores decimal(30,10);
        ganancia_taionca decimal(30,10);
        taionca_amount decimal(30,10);
    BEGIN
        
            INSERT INTO closure_odts (id_user, id_odt, id_account, amount, admin_expense_percent) 
            VALUES (v_id_user, v_id_odt, v_id_account, v_amount, admin_expense_percent)
            RETURNING id_closure_odt INTO new_closure_odt;

            WITH new_admin_closure_odts AS (
                INSERT INTO admin_closure_odts (id_closure_odt, id_user, profit_percent)
                SELECT new_closure_odt.id_closure_odt, id_user, profit_percent
                FROM json_to_recordset(admin_users) AS x("id_user" int, "profit_percent" decimal(5,5))
                RETURNING id_admin_closure_odt, id_closure_odt, profit_percent
            )
            SELECT sum(profit_percent) INTO admin_profit_percent
            FROM new_admin_closure_odts
            GROUP BY id_closure_odt;

            WITH new_operative_closure_odts AS (
                INSERT INTO operative_closure_odts (id_closure_odt, id_user, profit_percent)
                SELECT new_closure_odt.id_closure_odt, id_user, profit_percent
                FROM json_to_recordset(operative_users) AS x("id_user" int, "profit_percent" decimal(5,5))
                RETURNING id_operative_closure_odt, id_closure_odt, profit_percent
            )
            SELECT sum(profit_percent) INTO operative_profit_percent
            FROM new_operative_closure_odts
            GROUP BY id_closure_odt;

            WITH new_supervisor_closure_odts AS (
                INSERT INTO supervisor_closure_odts (id_closure_odt, id_user, profit_percent)
                SELECT new_closure_odt.id_closure_odt, id_user, profit_percent
                FROM json_to_recordset(supervisor_users) AS x("id_user" int, "profit_percent" decimal(5,5))
                RETURNING id_supervisor_closure_odt, id_closure_odt, profit_percent
            )
            SELECT sum(profit_percent) INTO supervisor_profit_percent
            FROM new_supervisor_closure_odts
            GROUP BY id_closure_odt;
                
            SELECT sum(amount * rate) INTO general_expenses
            FROM general_expenses
            WHERE general_expenses.id_odt = v_id_odt
            GROUP BY general_expenses.id_odt;
            IF NOT FOUND THEN
                general_expenses := 0;
            END IF;

            admin_entity_profit := v_amount * admin_expense_percent;
            
            SELECT sum(spendable_inv_odt_expenses.amount * price * rate) INTO spendable_inv_odt_expenses
            FROM spendable_inv_odt_expenses
            JOIN spendable_stocks USING (id_spendable_stock)
            JOIN spendable_items USING (id_spendable_item)
            WHERE spendable_inv_odt_expenses.id_odt = v_id_odt
            GROUP BY id_odt;
            IF NOT FOUND THEN
                spendable_inv_odt_expenses := 0;
            END IF;

            SELECT sum(no_spendable_inv_odt_expenses.amount * price * rate) INTO no_spendable_inv_odt_expenses
            FROM no_spendable_inv_odt_expenses
            JOIN no_spendable_stocks USING (id_no_spendable_stock)
            JOIN no_spendable_items USING (id_no_spendable_item)
            WHERE no_spendable_inv_odt_expenses.id_odt = v_id_odt
            GROUP BY id_odt;
            IF NOT FOUND THEN
                no_spendable_inv_odt_expenses := 0;
            END IF;

            inv_expenses := spendable_inv_odt_expenses + no_spendable_inv_odt_expenses;

            ganancia := v_amount - general_expenses - admin_entity_profit - inv_expenses;
            
            ganancia_presidente := ganancia * president_profit_percent;

            ganancia_personal_administrativo := ganancia * admin_profit_percent;
            ganancia_personal_operativo := ganancia * operative_profit_percent;
            ganancia_supervisores := ganancia * supervisor_profit_percent;

            -- TAIONCA
            ganancia_taionca := ganancia - ganancia_personal_operativo - ganancia_presidente - ganancia_personal_administrativo - ganancia_supervisores;

            taionca_amount := ganancia_taionca + general_expenses + inv_expenses;

            PERFORM
                alter_balance(
                    id_balance,
                    taionca_amount,
                    new_closure_odt.id_closure_odt,
                    'closure_odts'
                )
            FROM balances
            WHERE balances.id_account = v_id_account AND id_entity = id_entity_taionca;

            -- Administración
            PERFORM
                alter_balance(
                    id_balance,
                    admin_entity_profit,
                    new_closure_odt.id_closure_odt,
                    'closure_odts'
                )
            FROM balances
            WHERE balances.id_account = v_id_account AND id_entity = id_entity_admin;

            -- Comisiones
                -- admin_closure_odts
                PERFORM
                    alter_balance(
                        id_balance,
                        ganancia * admin_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances, admin_closure_odts
                JOIN users ON admin_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;
                
                -- operative_closure_odts
                PERFORM
                    alter_balance(
                        id_balance,
                        ganancia * operative_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances, operative_closure_odts
                JOIN users ON operative_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;

                -- supervisor_closure_odts
                PERFORM
                    alter_balance(
                        id_balance,
                        ganancia * supervisor_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances, supervisor_closure_odts
                JOIN users ON supervisor_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;

                -- Presidente
                PERFORM
                    alter_balance(
                        id_balance,
                        ganancia_presidente,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances
                WHERE balances.id_account = v_id_account AND balances.id_entity = id_entity_president;

        RETURN 'success';
    END;
    $body$;

    -- CREATE FUNCTION no_spendable_inv_odt_expense (
    --     quantity decimal(30,10),
    --     v_id_no_spendable_stock integer,
    --     id_odt integer,
    --     description character varying,
    --     usd_currency_rate decimal(30,10)
    -- ) RETURNS text
    -- LANGUAGE plpgsql
    -- AS $body$
    -- DECLARE
    --     updated_no_spendable_stocks no_spendable_stocks;
    --     new_no_spendable_inv_odt_expense no_spendable_inv_odt_expenses;
    --     v_amount decimal(30,10);
    --     selected_balance balances;
    -- BEGIN
    --     UPDATE no_spendable_stocks
    --     SET amount = amount - quantity
    --     WHERE no_spendable_stocks.id_no_spendable_stock = v_id_no_spendable_stock
    --     RETURNING id_no_spendable_stock, id_no_spendable_item INTO updated_no_spendable_stocks;

    --     INSERT INTO public.no_spendable_inv_odt_expenses
    --         (amount, id_no_spendable_stock, id_odt, description, rate)
    --         VALUES (quantity, v_id_no_spendable_stock, id_odt, description, usd_currency_rate)
    --         RETURNING id_no_spendable_inv_odt_expense INTO new_no_spendable_inv_odt_expense;

    --     SELECT ((quantity) * price) INTO STRICT v_amount
    --     FROM updated_no_spendable_stocks
    --     JOIN no_spendable_items USING (id_no_spendable_item)
    --     WHERE id_no_spendable_stock = v_id_no_spendable_stock;
        
    --     SELECT * INTO STRICT selected_balance FROM balances
    --     WHERE id_balance = auto_select_balance(1, v_amount, 1);

    --     SELECT alter_balance(
    --         balances.id_balance,
    --         CASE WHEN balances.id_entity=1 THEN -v_amount ELSE v_amount END,
    --         id_no_spendable_inv_odt_expense,
    --         'no_spendable_inv_odt_expenses'
    --     ) FROM new_no_spendable_inv_odt_expense, selected_balance
    --     JOIN balances
    --         ON balances.id_account = selected_balance.id_account
    --         AND balances.id_entity IN (1,3)
    --     ;

    -- END;
    -- $body$;

    -- CREATE FUNCTION spendable_inv_odt_expense (
    --     quantity decimal(30,10),
    --     v_id_spendable_stock integer,
    --     id_odt integer,
    --     description character varying,
    --     usd_currency_rate decimal(30,10)
    -- ) RETURNS text
    -- LANGUAGE plpgsql
    -- AS $body$
    -- DECLARE
    --     updated_spendable_stocks spendable_stocks;
    --     new_spendable_inv_odt_expense spendable_inv_odt_expenses;
    --     v_amount decimal(30,10);
    --     selected_balance balances;
    -- BEGIN
    --     UPDATE spendable_stocks
    --     SET amount = amount - quantity
    --     WHERE spendable_stocks.id_spendable_stock = v_id_spendable_stock
    --     RETURNING id_spendable_stock, id_spendable_item INTO updated_spendable_stocks;

    --     INSERT INTO public.spendable_inv_odt_expenses
    --         (amount, id_spendable_stock, id_odt, description, rate)
    --         VALUES (quantity, v_id_spendable_stock, id_odt, description, usd_currency_rate)
    --         RETURNING id_spendable_inv_odt_expense INTO new_spendable_inv_odt_expense;

    --     SELECT ((quantity) * price) INTO STRICT v_amount
    --     FROM updated_spendable_stocks
    --     JOIN spendable_items USING (id_spendable_item)
    --     WHERE updated_spendable_stocks.id_spendable_stock = v_id_spendable_stock;
        
    --     SELECT * INTO STRICT selected_balance FROM balances
    --     WHERE id_balance = auto_select_balance(1, v_amount, 1);

    --     SELECT alter_balance(
    --         balances.id_balance,
    --         CASE WHEN balances.id_entity=1 THEN -v_amount ELSE v_amount END,
    --         id_spendable_inv_odt_expense,
    --         'spendable_inv_odt_expenses'
    --     ) FROM new_spendable_inv_odt_expense, selected_balance
    --     JOIN balances
    --         ON balances.id_account = selected_balance.id_account
    --         AND balances.id_entity IN (1,3)
    --     ;

    -- END;
    -- $body$;
    `

};

exports.down = pgm => {
    pgm.sql`
    -- DROP FUNCTION IF EXISTS spendable_inv_odt_expense;
    -- DROP FUNCTION IF EXISTS no_spendable_inv_odt_expense;
    DROP FUNCTION IF EXISTS closure_odt;
    DROP FUNCTION IF EXISTS alter_balance;
    DROP FUNCTION IF EXISTS auto_select_balance;
    
    `
};
