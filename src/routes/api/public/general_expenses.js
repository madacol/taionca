import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_account, id_odt, amount, description } = req.body;
        const {rows: general_expenses} = await query(
            `
            WITH new_general_expense as (
                INSERT INTO public.general_expenses
                    ( id_account, id_odt, amount, description )
                    VALUES ( $1::integer, $2::integer, $3::decimal, $4::character varying )
                    RETURNING id_general_expense
            )
            SELECT alter_balance(id_balance, -$3, id_general_expense, 'general_expenses')
            FROM new_general_expense, balances
            WHERE id_account = $1
                AND id_entity = 1
            ;
            `, [id_account, id_odt, Math.abs(amount), description ]
        );

        res.json( general_expenses[0] );
    }