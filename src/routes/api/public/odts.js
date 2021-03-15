import { query } from "../../../db";

// List active odts
export const get =
    async (req, res) => {

        const {rows: odts} = await query(
            `select odts.*, currencys.*, clients.*
            from odts
            join currencys using(id_currency)
            join clients using(id_client)
            left join closure_odts using(id_odt)
            where id_closure_odt is null;
            `
        );

        res.json(
            odts
        );
    }
