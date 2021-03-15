import { compose } from "compose-middleware";
import fetch from "node-fetch";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_account, id_odt, amount, description, odt_currency_code, expense_currency_code } = req.body;
        /**
         * currency_code should not be received from frontend, is a vulnerability
         * se debe hacer previamente un query para obtener la moneda de la ODT
         */
        let rate;
        if (odt_currency_code !== expense_currency_code) {
            const response = await fetch(`https://bolivarparalelo.com/api/rate/${odt_currency_code}/${expense_currency_code}`);
            const rates = await response.json();
            rate = (rates.buy + rates.sell) / 2;
        } else {
            rate = 1;
        }
        const {rows: general_expenses} = await query(
            `
            WITH new_general_expense as (
                INSERT INTO public.general_expenses
                    ( id_account, id_odt, amount, description, rate )
                    VALUES ( $1::integer, $2::integer, $3::decimal, $4::character varying, $5 )
                    RETURNING id_general_expense
            )
            SELECT alter_balance(id_balance, -$3, id_general_expense, 'general_expenses')
            FROM new_general_expense, balances
            WHERE id_account = $1
                AND id_entity = 1
            ;
            `, [id_account, id_odt, Math.abs(amount), description, rate ]
        );

        res.json( general_expenses[0] );
    }