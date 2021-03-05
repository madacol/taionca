import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_account, id_currency, amount, description } = req.body;
        const {rows: admin_expenses} = await query(
            `INSERT INTO public.admin_expenses
                ( id_account, id_currency, amount, description )
                VALUES ( $1::integer, $2::integer, $3::decimal, $4::character varying )
                RETURNING id_admin_expense;
            `, [id_account, id_currency, amount, description ]
        );

        res.json( admin_expenses[0] );
    }