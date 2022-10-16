import { sql } from "../../../db";

export const post =
    async (req, res) => {
        const { admin_percent, id_odt } = req.body;
        const {rows: odt_updated} = await sql`

            UPDATE odts
            SET admin_percent = ${admin_percent}::numeric
            WHERE id_odt = ${id_odt}::integer
            RETURNING *;
        `;
        let data = odt_updated[0]
        res.json({
            success:"Porcentaje de administración actualizado.",
            data
        });
    }