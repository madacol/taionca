import { query } from "../../../db";

// List measures
export const get =
    async (req, res) => {

        const {rows: measures} = await query(
            `select * from measures;`
        );

        res.json(
            measures
        );
    }
