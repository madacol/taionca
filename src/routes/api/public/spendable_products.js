import { query } from "../../../db";

// List spendable_products
export const get =
    async (req, res) => {

        const {rows: spendable_products} = await query(
            `select * from spendable_products;`
        );

        res.json(
            spendable_products
        );
    }
