import { query } from "../../../db";

// List accounts
export const get =
    async (req, res) => {

        const {rows: accounts} = await query(
            `select *
            from accounts
            join currencys using(id_currency);`
        );

        res.json({
            accounts
        });
    }
