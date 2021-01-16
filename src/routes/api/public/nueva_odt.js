import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { contractAmount, id_currency, id_client, description } = req.body;
        const {rows: odts} = await query(
            `INSERT INTO public.odts
                (id_currency, id_client, amount, description)
                VALUES ($1::integer, $2::integer, $3::numeric, $4::character varying)
                RETURNING id_odt;
            `, [id_currency, id_client, contractAmount, description]
        );

        res.json( odts[0] );
    }
