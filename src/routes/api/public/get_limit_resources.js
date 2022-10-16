import { sql } from "../../../db";

// List limit_resources
export const get =
    async (req, res) => {
        const {rows: limit_resources} = await sql`
        
            SELECT * FROM limit_resources;
                
            `;

        res.json({
            limit_resources
        });
    }
