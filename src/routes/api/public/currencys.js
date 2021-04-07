import { query } from "../../../db";

// List currencys
export const get =
    async (req, res) => {

        const {rows: currencys} = await query(
            'select * from currencys;'
        );

        res.json(
            currencys
        );
    }
