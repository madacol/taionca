import { query } from "../../../db";

// List all_inv_items
export const get =
    async (req, res) => {

        const promise1 = query(
            `
            select

            id_spendable_stock,
            spendable_stocks.amount as spendable_stocks_amount,
            storages.name as storages_name,
            spendable_products.code as spendable_products_code,
            measures.unit

            from spendable_items
            join brands using(id_brand)
            join spendable_products using(id_spendable_product)
            join spendable_stocks using(id_spendable_item)
            join storages using(id_storage)
            join measures using(id_measure);
            `
        );

        const promise2 = query(
            `
            select

            id_no_spendable_stock,
            no_spendable_stocks.amount as no_spendable_stocks_amount,
            storages.name as storages_name,
            no_spendable_products.code as no_spendable_products_code,
            measures.unit

            from no_spendable_items
            join brands using(id_brand)
            join no_spendable_products using(id_no_spendable_product)
            join no_spendable_stocks using(id_no_spendable_item)
            join storages using(id_storage)
            join measures using(id_measure);
            `
        );
        
        const {rows: spendable_stocks} = await promise1
        const {rows: no_spendable_stocks} = await promise2
        res.json(
            {spendable_stocks, no_spendable_stocks}
        );
    }