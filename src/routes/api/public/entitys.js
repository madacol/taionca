import { query } from "../../../db";

// List entitys
export const get =
    async (req, res) => {

        const {rows: entitys} = await query(
            `select * from entitys;`
        );

        res.json(
            entitys
        );
    }
