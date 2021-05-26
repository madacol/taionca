import { query } from "../../../db";

// List storages
export const get =
    async (req, res) => {

        const {rows: storages} = await query(
            `select * from storages;`
        );

        res.json({
            storages
        });
    }
