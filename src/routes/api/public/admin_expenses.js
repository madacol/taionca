import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import { getRate } from "../../../functions";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

// Rate based in dollars

export const post =
    async (req, res) => {
        const { id_account, amount, description, expense_currency_code } = req.body;
        const rate = await getRate('usd', expense_currency_code);
        console.log({rate});
        const {rows: admin_expenses} = await sql`
            WITH new_admin_expense as (
                INSERT INTO public.admin_expenses
                    ( id_account,  amount, description, rate)
                    VALUES ( ${id_account}::integer,  ${amount}::decimal(30,10), ${description}::character varying, ${rate}::decimal(30,10) )
                    RETURNING id_admin_expense
            )
            SELECT alter_balance(id_balance, ${-amount}::decimal(30,10), id_admin_expense, 'admin_expenses')
            FROM new_admin_expense, balances
            WHERE id_account = ${id_account}
                AND id_entity = 2
            ;
        `;

        res.json( admin_expenses[0] );
    }