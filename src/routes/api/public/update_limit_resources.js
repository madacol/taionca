import { sql } from "../../../db";

export const post =
    async (req, res) => {
        const { id_user, id_account, amount } = req.body;
        const {rows: updated_limit_resources} = await sql`

            INSERT INTO limit_resources
                ( id_user, id_account, amount )
                VALUES (${id_user}::integer, ${id_account}::integer, ${amount}::numeric)
                ON CONFLICT (id_user) DO 
                UPDATE SET amount = ${amount}::numeric
                WHERE limit_resources.id_account = ${id_account}::integer AND limit_resources.id_user = ${id_user}::integer
                RETURNING *; 

        `;
        let data = updated_limit_resources[0]
        res.json({
            success:"Límite de recursos actualizado.",
            data
        });
    }