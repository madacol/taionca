import { sql } from "../../../../db";

// List balance_registers
export const get =
    async (req, res) => {
        const {range_date} = req.params;
        console.log('hola', range_date[0], range_date[1])
        const {rows: balance_registers} = await sql`
            select  created_at, balance, id_balance
            from balance_registers;
            `
        ;

        res.json({
            balance_registers
        }
        );
    }
