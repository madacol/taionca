import { query } from "../../../db";

// List suppliers
export const get =
    async (req, res) => {

        const {rows: suppliers} = await query(
            `select * from suppliers;`
        );

        res.json({
            suppliers
        });
    }
