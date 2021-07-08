import { query } from "../../../db";

// List time_frequencys
export const get =
    async (req, res) => {

        const {rows: time_frequencys} = await query(
            `select * from time_frequencys;`
        );

        res.json({
            time_frequencys
        });
    }
