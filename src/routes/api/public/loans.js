import { query } from "../../../db";

// List loans
export const get =
    async (req, res) => {

        const {rows: loans} = await query(
            `select *
            from loans
            join currencys using (id_currency);
            `
        );

        res.json({
            loans
        });
    }
