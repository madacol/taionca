import { query } from "../../../db";

// List loans_register
export const get =
    async (req, res) => {

        const {rows: loans_register} = await query(
            `select *
            from loans_registers
            join currencys using (id_currency);
            `
        );

        res.json({
            loans_register
        });
    }
