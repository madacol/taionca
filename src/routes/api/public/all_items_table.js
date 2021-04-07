import { query } from "../../../db";
import { onMount } from 'svelte';

// List all_inv_items
export const get =
    async (req, res) => {

        let items;
        onMount(async ()=>{
            const response = await fetch('/api/public/all_items');
            items = await response.json();
        })
    
        let itemsToList= [];
        let spendable_itemsToList = [];
        let no_spendable_itemsToList = [];
        $: if (items) {
            let spendable_items=items.spendable_stocks;
            spendable_itemsToList = spendable_items.map(( spendable_item ) => {
                return ({id: spendable_item.spendable_products_code, 
                        code: spendable_item.spendable_products_code,
                        description: spendable_item.description,
                        amount: spendable_item.spendable_stocks_amount,
                        price_sell: spendable_item.price,
                        price_cost: spendable_item.cost,
                        status: "NULL"})
            })
        }
    
        $: if (items) {
            let no_spendable_items=items.no_spendable_stocks;
            no_spendable_itemsToList = no_spendable_items.map(( no_spendable_item ) => {
                return ({id: no_spendable_item.no_spendable_products_code, 
                        code: no_spendable_item.no_spendable_products_code,
                        description: no_spendable_item.description,
                        amount: no_spendable_item.no_spendable_stocks_amount,
                        price_sell: no_spendable_item.price,
                        price_cost: no_spendable_item.cost,
                        status: "NULL"})
            })
        }
        $: if (items) {
            itemsToList= spendable_itemsToList.concat(no_spendable_itemsToList)
        }
        $: console.log(itemsToList);
        $: console.log(rows);
        res.json(
            itemsToList
        );
    }