import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { query } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const { id_client, id_user, id_currency, id_entity, amount, description } = req.body;
        const {rows: odts} = await query(
            `INSERT INTO public.odts
                ( id_client, id_user, id_currency, id_entity, amount, description )
                VALUES ($1::integer, $2::integer, $3::integer, $4::integer, $5::numeric, $6::character varying)
                RETURNING id_odt;
            `, [ id_client, id_user, id_currency, id_entity, amount, description ]
        );

        res.json( odts[0] );
    }
