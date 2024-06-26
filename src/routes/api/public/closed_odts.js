import { query } from "../../../db";

// List active odts
export const get =
    async (req, res) => {

        const {rows: odts} = await query(
            `select currencys.*, clients.*, users.name as user_name, odts.* , odts.created_at as created_at, closure_odts.created_at as closed_at
            from odts
            join users on users.user_id = odts.id_user
            join currencys using(id_currency)
            join clients using(id_client)
            LEFT join closure_odts using(id_odt)
            where id_closure_odt is NOT null;
            `
        );
        res.json({
            odts
        });
    }
