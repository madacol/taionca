import { query } from "../../../db";

// List accounts
export const get =
    async (req, res) => {
        console.log("API");
        const {rows: accounts} = await query(
            `select *
            from accounts
            join currencys using(id_currency);`
        );

        res.json({
            accounts
        });
    }
