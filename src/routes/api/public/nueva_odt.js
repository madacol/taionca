import { compose } from "compose-middleware";
import { USERS_READ } from "../../../constants/PERMISSIONS";
import { sql } from "../../../db";
import checkPermissionsMW from "../../../middlewares/checkPermissionsMW";

export const post =
    async (req, res) => {
        const {user_id} = req.session.user;
        const { id_client, id_currency, id_entity, amount, description } = req.body;
        const {rows: odts} = await sql`
            INSERT INTO public.odts
                ( id_client, id_user, id_currency, id_entity, amount, description )
                VALUES (${id_client}::integer, ${user_id}::integer, ${id_currency}::integer, ${id_entity}::integer, ${amount}::numeric, ${description}::character varying)
                RETURNING id_odt;
            `
        ;

        res.json( odts[0] );
    }
