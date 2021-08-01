exports.up = pgm => {
    pgm.sql`
        create table payroll_variables(
            id_payroll_variable serial primary key,
            base_salary decimal (30,10), --By hour
            food_voucher decimal (30,10), --By hour
            base_extra_salary decimal (30,10), --By each extra_hour
            ivss_discount decimal (5,5),
            created_at timestamp with time zone default current_timestamp
        );

        create table payroll_odt_hours(
            id_payroll_odt_hour serial primary key,
            id_supervisor integer not null REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
            id_odt int REFERENCES odts (id_odt) ON UPDATE CASCADE  ON DELETE CASCADE,
            id_user integer not null REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE,
            hours_spent decimal (4,2),
            is_paid boolean default FALSE,
            created_at timestamp with time zone default current_timestamp
        );

        create table payroll_records(
            id_payroll_record serial primary key,
            id_payroll_odt_hour integer not null REFERENCES payroll_odt_hours (id_payroll_odt_hour) ON UPDATE CASCADE ON DELETE CASCADE,
            id_general_expense integer not null REFERENCES general_expenses (id_general_expense) ON UPDATE CASCADE ON DELETE CASCADE,
            created_at timestamp with time zone default current_timestamp
        );

        INSERT INTO payroll_variables
        (base_salary, food_voucher, base_extra_salary, ivss_discount)
        VALUES (29166.6666666666, 17045.4545454545, 58333.3333333333, 0.045);

        -- SELECT (date_trunc('MONTH', $1) + INTERVAL '1 MONTH - 1 day')::date;
        -- $body$ LANGUAGE 'sql' IMMUTABLE STRICT;

        CREATE OR REPLACE FUNCTION last_day(v_date timestamp)
        RETURNS date
        LANGUAGE plpgsql
        AS $body$
        DECLARE
        last_day date;
        BEGIN
           
            SELECT (date_trunc('MONTH', $1) + INTERVAL '1 MONTH - 1 day')::date INTO last_day;

            RETURN last_day;
        END;
        $body$;

        CREATE OR REPLACE FUNCTION payroll_preview(
            v_hours_by_odt json
        )
        -- RETURNS SETOF RECORD
        RETURNS TABLE(
            v_id_user int,
            v_id_account int,
            v_total_hours payroll_odt_hours.hours_spent%TYPE,
            -- payroll_odt_hours int[],
            v_amount decimal(30,10)
        )
        LANGUAGE plpgsql
        AS $body$
        DECLARE
            v_payroll_variables record;
            last_week date;
            weeks_remaining integer;
        BEGIN
            
            RAISE NOTICE 'OLAAAAAAA';

            SET LOCAL TIMEZONE='America/Caracas';

            -- Get payroll settings (salary, taxes, food vouchers)
            SELECT * INTO v_payroll_variables 
            FROM (SELECT MAX(id_payroll_variable) as id_payroll_variable FROM payroll_variables) as last_payroll_variables 
            JOIN payroll_variables USING (id_payroll_variable);

            -- Get last payroll date
            SELECT created_at::date INTO last_week
            FROM payroll_records
            ORDER BY id_payroll_record DESC
            LIMIT 1;

            -- Calculate how many weeks have passed since last payroll
            SELECT COALESCE(
                    (
                        (
                            extract(epoch from date_trunc('week', now()::date))
                            -
                            extract(epoch from date_trunc('week', last_week::date))
                        ) / (60*60*24*7)
                    ),
                    1
                ) INTO weeks_remaining;

            -- Calculate hours and amounts to pay
            RETURN QUERY 
            WITH payroll_data as (

                SELECT 
                    x.id_payroll_odt_hour, 
                    x.id_account, 
                    x.rate, 
                    payroll_odt_hours.id_odt,
                    payroll_odt_hours.id_user, 
                    payroll_odt_hours.hours_spent, 
                    payroll_odt_hours.is_paid
                FROM json_to_recordset(v_hours_by_odt) as x("id_payroll_odt_hour" int, "id_account" int, "rate" decimal(30,10))
                JOIN payroll_odt_hours using(id_payroll_odt_hour)

            )
                    
            SELECT
                id_user,
                id_account,
                total_hours,
                -- payroll_odt_hours,
                (
                    CASE WHEN hours_worked.total_hours <= (32 * weeks_remaining) THEN

                        (hours_worked.total_hours * v_payroll_variables.base_salary + hours_worked.total_hours * v_payroll_variables.food_voucher) * (1 - v_payroll_variables.ivss_discount)
                    
                    WHEN hours_worked.total_hours <= (40 * weeks_remaining) THEN

                        ((hours_worked.total_hours * v_payroll_variables.base_salary + hours_worked.total_hours * v_payroll_variables.food_voucher) + (16 * weeks_remaining * v_payroll_variables.base_salary)) * (1 - v_payroll_variables.ivss_discount)
                    
                    WHEN hours_worked.total_hours > (40 * weeks_remaining) THEN

                        ((40 * weeks_remaining * v_payroll_variables.base_salary + 40 * weeks_remaining * v_payroll_variables.food_voucher) + (16 * weeks_remaining * v_payroll_variables.base_salary) + ((hours_worked.total_hours- (40* weeks_remaining)) * v_payroll_variables.base_extra_salary)) * (1 - v_payroll_variables.ivss_discount)
                    END 
                ) AS amount

            FROM (
                SELECT
                    payroll_data.id_user,
                    payroll_data.id_account,
                    -- array_agg(id_payroll_odt_hour) AS payroll_odt_hours,
                    SUM(hours_spent) as total_hours
                FROM payroll_data
                GROUP BY id_user, id_account
            ) AS hours_worked;

        END;
        $body$;



        CREATE OR REPLACE FUNCTION payroll(
            v_hours_by_odt json
        )
        RETURNS text
        LANGUAGE PLPGSQL
        AS $body$
        BEGIN

            WITH payroll_data as (

                SELECT 
                    x.id_payroll_odt_hour, 
                    x.id_account, 
                    x.rate, 
                    payroll_odt_hours.id_odt,
                    payroll_odt_hours.id_user, 
                    payroll_odt_hours.hours_spent, 
                    payroll_odt_hours.is_paid
                FROM json_to_recordset(v_hours_by_odt) as x("id_payroll_odt_hour" int, "id_account" int, "rate" decimal(30,10))
                JOIN payroll_odt_hours using(id_payroll_odt_hour)

            ), total_user_account_data AS (
                SELECT
                    v_id_user AS id_user,
                    v_id_account AS id_account,
                    v_total_hours AS total_hours,
                    v_amount AS amount
                FROM payroll_preview(v_hours_by_odt)
            ), new_general_expense as (

                INSERT INTO public.general_expenses
                    ( id_account, id_odt, amount, description, rate, id_measure, quantity )
                SELECT
                    total_user_account_data.id_account,
                    payroll_data.id_odt,
                    ( (payroll_data.hours_spent / total_user_account_data.total_hours) * total_user_account_data.amount ) AS amount,
                    'Pago de nómina',
                    payroll_data.rate,
                    9, -- id_measure for hours 
                    payroll_data.hours_spent

                FROM total_user_account_data
                JOIN payroll_data using(id_user, id_account)
                RETURNING id_general_expense, amount, id_account
            )--, _t as (
                SELECT 
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                        id_balance,
                        (-new_general_expense.amount),
                        new_general_expense.id_general_expense,
                        'general_expenses'
                    )
                FROM new_general_expense, balances
                WHERE balances.id_account = new_general_expense.id_account AND balances.id_entity = 1
            
            -- ), __t as (
            --     INSERT INTO payroll_records
            --         (id_payroll_odt_hour, id_general_expense)
            --     SELECT 
            --         payroll_data.id_payroll_odt_hour,
            --         new_general_expense.id_general_expense
            --     FROM payroll_data, new_general_expense
            --     -- WHERE payroll_data.id_payroll_odt_hour IN new_general_expense

            -- )
            --     UPDATE payroll_odt_hours
            --     SET payroll_odt_hours.is_paid = TRUE
            --     FROM payroll_data USING(id_payroll_odt_hour)
            ;

            RETURN 'success';
            
        END;
        $body$;

        create table payroll_not_assign_hours(
            id_payroll_not_assign_hour serial primary key,
            id_user integer not null REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE UNIQUE,
            hours double precision,
            created_at timestamp with time zone default current_timestamp
        );
  
        `
};
exports.down = pgm => {
    pgm.sql`
         
         drop table if exists payroll_not_assign_hours;
         drop function if exists payroll;
         drop function if exists payroll_preview;
         drop function if exists last_day;
         drop table if exists payroll_records;
         drop table if exists payroll_odt_hours;
         drop table if exists payroll_variables;
        `
};