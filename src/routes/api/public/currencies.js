import { query } from "../../../db";

// List currencies
export const get =
    async (req, res) => {

        const {rows: currencies} = await query(
            'select * from currencies;'
        );

        res.json(
            currencies
        );
    }
