exports.up = pgm => {
    pgm.sql`

    CREATE OR REPLACE FUNCTION closure_odt (
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

            RAISE NOTICE 'value of v_amount : %', v_amount;
            RAISE NOTICE 'value of general_expenses : %', general_expenses;
            RAISE NOTICE 'value of admin_entity_profit : %', admin_entity_profit;
            RAISE NOTICE 'value of inv_expenses : %', inv_expenses;

            ganancia := v_amount - general_expenses - admin_entity_profit - inv_expenses;
            
            ganancia_presidente := ganancia * president_profit_percent;

            ganancia_personal_administrativo := ganancia * admin_profit_percent;
            ganancia_personal_operativo := ganancia * operative_profit_percent;
            ganancia_supervisores := ganancia * supervisor_profit_percent;

            -- TAIONCA
            ganancia_taionca := ganancia - ganancia_personal_operativo - ganancia_presidente - ganancia_personal_administrativo - ganancia_supervisores;

            taionca_amount := ganancia_taionca + general_expenses + inv_expenses;

            PERFORM
                alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                    id_balance,
                    taionca_amount,
                    new_closure_odt.id_closure_odt,
                    'closure_odts'
                )
            FROM balances
            WHERE balances.id_account = v_id_account AND id_entity = id_entity_taionca;

            -- Administración
            PERFORM
                alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
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
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                        id_balance,
                        ganancia * admin_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances
                JOIN admin_closure_odts ON admin_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt
                JOIN users ON admin_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;
                
                -- operative_closure_odts
                PERFORM
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                        id_balance,
                        ganancia * operative_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances
                JOIN operative_closure_odts ON operative_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt
                JOIN users ON operative_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;

                -- supervisor_closure_odts
                PERFORM
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                        id_balance,
                        ganancia * supervisor_closure_odts.profit_percent,
                        new_closure_odt.id_closure_odt,
                        'closure_odts'
                    )
                FROM balances
                JOIN supervisor_closure_odts ON supervisor_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt
                JOIN users ON supervisor_closure_odts.id_user = users.user_id
                WHERE balances.id_account = v_id_account AND balances.id_entity = users.id_entity;

                -- Presidente
                PERFORM
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
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

    ALTER TABLE public.general_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.admin_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.spendable_inv_odt_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.no_spendable_inv_odt_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.quotation_general_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.quotation_spendable_inv_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;
    ALTER TABLE public.quotation_no_spendable_inv_expenses ALTER COLUMN rate TYPE numeric(40,20) USING rate::numeric;


    WITH new_entity AS (
            INSERT INTO public.entitys (name)
                VALUES ('bruchogun')
                RETURNING id_entity
        ), t_ as(
            INSERT INTO balances (id_account, id_entity)
            SELECT id_account, id_entity FROM accounts, new_entity
        )
        INSERT INTO users (user_id, username, password_hash, name, email, lastname, id_entity)
            SELECT 100, 'bruchogun', '$argon2i$v=19$m=4096,t=10,p=1$LU4KP3vETVtzvV2Mkrvd+A$9dcyOO3f2ehegvj9gwLYsVKuBsIx5Nu/3YBD4nodDhk', 'Mauro Alejandro', 'mauro.dagostini@outlook.com', 'DAgostini Báez', id_entity
            FROM new_entity
        ;
`
};

exports.down = pgm => {
    pgm.sql`
    DROP FUNCTION IF EXISTS closure_odt;
    
    `
};