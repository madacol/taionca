import { sql } from "../../../db";

// List limit_resources
export const get =
    async (req, res) => {
        const {rows: limit_resources} = await sql`
        
            SELECT 
                amount,
                id_account,
                id_limit_resource,
                id_odt,
                id_currency,
                name_singular,
                name_plural,
                name,
                symbol,
                code
            FROM limit_resources
            JOIN accounts USING(id_account)
            JOIN currencys USING(id_currency);
                
            `;

        res.json({
            limit_resources
        });
    }
