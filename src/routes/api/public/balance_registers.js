import { query } from "../../../db";

// List balance_registers
export const get =
    async (req, res) => {

        const {rows: balance_registers} = await query(
            `select *, balance_registers.balance
            from balance_registers
            join balances using(id_balance)
            join accounts using(id_account)
            join currencys using(id_currency);
            `
        );

        res.json({
            balance_registers
        });
    }
