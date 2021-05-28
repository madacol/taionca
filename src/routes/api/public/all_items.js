import { query } from "../../../db";

// List all_inv_items
export const get =
    async (req, res) => {

        const promise1 = query(
            `
            select

            id_spendable_stock,
            spendable_stocks.amount as spendable_stocks_amount,
            id_storage,
            storages.name as storages_name,
            spendable_products.code as spendable_products_code,
            measures.unit,
            spendable_products.description,
            spendable_products.manufacture,
            spendable_items.cost,
            spendable_items.price,
            min_stock,
            mid_stock,
            max_stock,
            suppliers.name as supplier

            from spendable_items
            join brands using(id_brand)
            join spendable_products using(id_spendable_product)
            join spendable_stocks using(id_spendable_item)
            join storages using(id_storage)
            join measures using(id_measure)
            join suppliers using(id_supplier);
            `
        );

        const promise2 = query(
            `
            select

            id_no_spendable_stock,
            no_spendable_stocks.amount as no_spendable_stocks_amount,
            id_storage,
            storages.name as storages_name,
            no_spendable_products.code as no_spendable_products_code,
            measures.unit,
            no_spendable_products.description,
            no_spendable_products.manufacture,
            no_spendable_items.cost,
            no_spendable_items.price,
            min_stock,
            mid_stock,
            max_stock,
            suppliers.name as supplier

            from no_spendable_items
            join brands using(id_brand)
            join no_spendable_products using(id_no_spendable_product)
            join no_spendable_stocks using(id_no_spendable_item)
            join storages using(id_storage)
            join measures using(id_measure)
            join suppliers using(id_supplier);
            `
        );
        
        const {rows: spendable_stocks} = await promise1
        const {rows: no_spendable_stocks} = await promise2
        res.json({
            spendable_stocks,
            no_spendable_stocks
        });
    }