import { query } from "../../../db";

// List odts
export const get =
    async (req, res) => {

        const {rows: odts} = await query(
            `select *
            from odts
            join currencys using(id_currency)
            join clients using(id_client);`
        );

        res.json(
            odts
        );
    }
