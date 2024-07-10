exports.up = pgm => {
    pgm.sql`

    ALTER TABLE closure_odts ADD COLUMN IF NOT EXISTS taionca_profit decimal(30,10) DEFAULT 0;
    ALTER TABLE closure_odts ADD COLUMN IF NOT EXISTS general_expense decimal(30,10) DEFAULT 0;
    ALTER TABLE closure_odts ADD COLUMN IF NOT EXISTS inv_expense decimal(30,10) DEFAULT 0;
    ALTER TABLE closure_odts ADD COLUMN IF NOT EXISTS gross_profit decimal(30,10) DEFAULT 0;

    ALTER TABLE admin_closure_odts ADD COLUMN IF NOT EXISTS profit decimal(30,10) DEFAULT 0;
    ALTER TABLE operative_closure_odts ADD COLUMN IF NOT EXISTS profit decimal(30,10) DEFAULT 0;
    ALTER TABLE supervisor_closure_odts ADD COLUMN IF NOT EXISTS profit decimal(30,10) DEFAULT 0;

    ALTER TABLE admin_closure_odts ADD UNIQUE (id_closure_odt, id_user);
    ALTER TABLE operative_closure_odts ADD UNIQUE (id_closure_odt, id_user);
    ALTER TABLE supervisor_closure_odts ADD UNIQUE (id_closure_odt, id_user);

    CREATE TABLE ceo_closure_odts (
        id_ceo_closure_odt serial primary key,
        id_closure_odt int REFERENCES closure_odts (id_closure_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
        id_user int REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE not null,
        profit_percent decimal(5,5) not null,
        profit decimal(30,10) DEFAULT 0,
        created_at timestamp with time zone default current_timestamp,
        UNIQUE (id_closure_odt, id_user)
    );

    CREATE OR REPLACE FUNCTION closure_odt (
        v_id_account integer,
        v_id_odt integer,
        v_id_user integer,
        v_amount decimal(30,10),
        v_id_user_ceo integer,
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
            IF NOT FOUND THEN
                admin_profit_percent := 0;
            END IF;

            WITH new_operative_closure_odts AS (
                INSERT INTO operative_closure_odts (id_closure_odt, id_user, profit_percent)
                SELECT new_closure_odt.id_closure_odt, id_user, profit_percent
                FROM json_to_recordset(operative_users) AS x("id_user" int, "profit_percent" decimal(5,5))
                RETURNING id_operative_closure_odt, id_closure_odt, profit_percent
            )
            SELECT sum(profit_percent) INTO operative_profit_percent
            FROM new_operative_closure_odts
            GROUP BY id_closure_odt;
            IF NOT FOUND THEN
                operative_profit_percent := 0;
            END IF;

            WITH new_supervisor_closure_odts AS (
                INSERT INTO supervisor_closure_odts (id_closure_odt, id_user, profit_percent)
                SELECT new_closure_odt.id_closure_odt, id_user, profit_percent
                FROM json_to_recordset(supervisor_users) AS x("id_user" int, "profit_percent" decimal(5,5))
                RETURNING id_supervisor_closure_odt, id_closure_odt, profit_percent
            )
            SELECT sum(profit_percent) INTO supervisor_profit_percent
            FROM new_supervisor_closure_odts
            GROUP BY id_closure_odt;
            IF NOT FOUND THEN
                supervisor_profit_percent := 0;
            END IF;

            INSERT INTO ceo_closure_odts (id_closure_odt, id_user, profit_percent)
            VALUES (new_closure_odt.id_closure_odt, v_id_user_ceo, president_profit_percent);
                
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

            ganancia_taionca := ganancia - ganancia_personal_operativo - ganancia_presidente - ganancia_personal_administrativo - ganancia_supervisores;

            taionca_amount := ganancia_taionca + general_expenses + inv_expenses;

            UPDATE closure_odts
            SET taionca_profit = taionca_amount, general_expense = general_expenses, inv_expense = inv_expenses, gross_profit = ganancia
            WHERE closure_odts.id_odt = v_id_odt;

            -- TAIONCA
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

                UPDATE admin_closure_odts
                SET profit = ganancia * admin_closure_odts.profit_percent
                WHERE admin_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt;
                
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

                UPDATE operative_closure_odts
                SET profit = ganancia * operative_closure_odts.profit_percent
                WHERE operative_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt;

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

                UPDATE supervisor_closure_odts
                SET profit = ganancia * supervisor_closure_odts.profit_percent
                WHERE supervisor_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt;

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

                UPDATE ceo_closure_odts
                SET profit = ganancia * ceo_closure_odts.profit_percent
                WHERE ceo_closure_odts.id_closure_odt = new_closure_odt.id_closure_odt;

        RETURN 'success';
    END;
    $body$;
`
};

exports.down = pgm => {
    pgm.sql`
    
    DROP FUNCTION IF EXISTS closure_odt(
        v_id_account integer,
        v_id_odt integer,
        v_id_user integer,
        v_amount decimal(30,10),
        v_id_user_ceo integer,
        admin_users json,
        operative_users json,
        supervisor_users json,
        admin_expense_percent decimal(5,5),
        president_profit_percent decimal(5,5)
    );
    DROP TABLE IF EXISTS ceo_closure_odts;
    ALTER TABLE closure_odts DROP COLUMN taionca_profit;
    ALTER TABLE closure_odts DROP COLUMN general_expense;
    ALTER TABLE closure_odts DROP COLUMN inv_expense;
    ALTER TABLE closure_odts DROP COLUMN gross_profit;
    ALTER TABLE admin_closure_odts DROP COLUMN profit;
    ALTER TABLE operative_closure_odts DROP COLUMN profit;
    ALTER TABLE supervisor_closure_odts DROP COLUMN profit
    
    `
};