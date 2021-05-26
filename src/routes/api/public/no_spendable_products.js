import { query } from "../../../db";

// List no_spendable_products
export const get =
    async (req, res) => {

        const {rows: no_spendable_products} = await query(
            `select * from no_spendable_products;`
        );

        res.json({
            no_spendable_products
        });
    }
