import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { payrolls } = req.body;

        const v_hours_by_odt = await Promise.all( payrolls.map(async payroll=>{
            const rate = await getRate(payroll.odt_code, payroll.payroll_code)
            return {
                ...payroll,
                rate
            };
        }));
        console.log(v_hours_by_odt);
        const {rows: payroll} = await res.sql`

            WITH payroll_data as (

                SELECT 
                    x.id_payroll_odt_hour, 
                    x.id_account, 
                    x.rate, 
                    payroll_odt_hours.id_odt,
                    payroll_odt_hours.id_user, 
                    payroll_odt_hours.hours_spent, 
                    payroll_odt_hours.is_paid
                FROM json_to_recordset(${JSON.stringify(v_hours_by_odt)}::json) as x("id_payroll_odt_hour" int, "id_account" int, "rate" decimal(30,10))
                JOIN payroll_odt_hours using(id_payroll_odt_hour)
                ORDER BY id_payroll_odt_hour

            ), total_user_account_data AS (
                SELECT
                    v_id_user AS id_user,
                    v_id_account AS id_account,
                    v_total_hours AS total_hours,
                    v_amount AS amount
                FROM payroll_preview(${JSON.stringify(v_hours_by_odt)}::json)
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
                ORDER BY payroll_data.id_payroll_odt_hour
                RETURNING id_general_expense, amount, id_account

            ), _t as (

                UPDATE payroll_odt_hours
                SET is_paid = TRUE
                FROM payroll_data 
                WHERE payroll_odt_hours.id_payroll_odt_hour = payroll_data.id_payroll_odt_hour
                
            ), __t as (

                INSERT INTO payroll_records
                    (id_payroll_odt_hour, id_general_expense)
                SELECT 
                    id_payroll_odt_hour,
                    id_general_expense
                FROM (SELECT *, row_number() OVER() AS i FROM payroll_data) AS _payroll_data
                JOIN (SELECT *, row_number() OVER() AS i FROM new_general_expense) AS _new_general_expense  USING(i)
                -- this is an horizontal JOIN, first row with first row, second with second, third with third ... and so on
                -- to make it work I ordered by id_payroll_odt_hour both tables, payroll_data and new_general_expense
                -- https://stackoverflow.com/questions/65869402/how-to-join-two-different-tables-horizontally-without-cross-join

            )
                SELECT
                    alter_balance( --Maldita sea, puto alter_balance siempre de ultimo en los WITHS!!!!!! 
                        id_balance,
                        (-new_general_expense.amount),
                        new_general_expense.id_general_expense,
                        'general_expenses'
                    )
                FROM new_general_expense, balances
                WHERE balances.id_account = new_general_expense.id_account AND balances.id_entity = 1
            ;
        
        `;

        res.json({
            success: `Nómina pagada`,
            payroll
        });

    }
     