import { query } from "../../../db";

// List balances
export const get =
    async (req, res) => {

        const {rows: balances} = await query(
            `select *
            from balances
            join accounts using(id_account)
            join currencys using(id_currency);
            `
        );

        res.json(
            balances
        );
    }
