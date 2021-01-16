import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_movement_category, id_account, amount, dollar_exchange_rate, description, movement_category} = req.body;
        const {rows: incomes} = await query(
            `INSERT INTO public.incomes
                (id_movement_category, id_account, amount, dollar_exchange_rate, description, movement_category )
                VALUES ($1::integer, $2::integer, $3::decimal, $4::decimal, $5::character varying, $6)
                RETURNING id_income;
            `, [id_movement_category, id_account, amount, dollar_exchange_rate, description, movement_category]
        );

        res.json( incomes[0] );
    }