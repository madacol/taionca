import { sql } from "../../../db";

export const post =
    async (req, res) => {
        const { id_odt, id_account, amount } = req.body;
        const {rows: updated_limit_resources} = await sql`

            INSERT INTO limit_resources
                ( id_odt, id_account, amount )
                VALUES (${id_odt}::integer, ${id_account}::integer, ${amount}::numeric)
                ON CONFLICT (id_odt, id_account) DO 
                UPDATE SET amount = ${amount}::numeric
                WHERE limit_resources.id_account = ${id_account}::integer AND limit_resources.id_odt = ${id_odt}::integer
                RETURNING *; 

        `;
        let data = updated_limit_resources[0]
        res.json({
            success:"Límite de recursos actualizado.",
            data
        });
    }