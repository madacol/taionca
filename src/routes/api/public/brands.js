import { query } from "../../../db";

// List brands
export const get =
    async (req, res) => {

        const {rows: brands} = await query(
            `select * from brands;`
        );

        res.json(
            brands
        );
    }
