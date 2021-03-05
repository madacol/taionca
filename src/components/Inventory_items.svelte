<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable} from "carbon-components-svelte";
	import Storages from '../components/Storages.svelte';

	let storage;
    const headers = [
        { key: 'code', value: 'Código' }, 
        { key: 'description', value: 'Descripción' },
        { key: 'amount', value: 'Cantidad disponible' },
        { key: 'price_cost', value: 'Precio Compra' },
        { key: 'price_sell', value: 'Precio Venta' },
        { key: 'min_stock', value: 'Stock minimo' },
        { key: 'mid_stock', value: 'Stock medio' },
        { key: 'max_stock', value: 'Stock máximo' },
        { key: 'status', value: 'Estado' }
    ]
	
    let items;
	onMount(async ()=>{
		const response = await fetch('/api/public/all_items');
		items = await response.json();
	})

	let itemsToList= [];
	let spendable_itemsToList = [];
	let no_spendable_itemsToList = [];
	$: if (items && storage) {
		const spendable_items=items.spendable_stocks;
		const items_filtered = spendable_items.filter(({id_storage}) => id_storage === storage.value);
		spendable_itemsToList = items_filtered.map(( spendable_item ) => {
			return ({id: spendable_item.id_spendable_stock, 
					code: spendable_item.spendable_products_code,
					description: spendable_item.description,
					amount: `${Number(spendable_item.spendable_stocks_amount).toFixed(2)} ${spendable_item.unit}`,
                    price_sell: `$ ${Number(spendable_item.price).toFixed(2)}`,
                    price_cost: `$ ${Number(spendable_item.cost).toFixed(2)}`,
                    min_stock: `$ ${Number(spendable_item.min_stock).toFixed(2)}`,
                    mid_stock: `$ ${Number(spendable_item.mid_stock).toFixed(2)}`,
                    max_stock: `$ ${Number(spendable_item.max_stock).toFixed(2)}`,
                    status: "NULL"})
		})
	}

	$: if (items && storage) {
		const no_spendable_items=items.no_spendable_stocks;
		const items_filtered = no_spendable_items.filter(({id_storage}) => id_storage === storage.value);
		no_spendable_itemsToList = items_filtered.map(( no_spendable_item ) => {
			return ({id: -no_spendable_item.id_no_spendable_stock,
					code: no_spendable_item.no_spendable_products_code,
					description: no_spendable_item.description,
					amount: `${Number(no_spendable_item.no_spendable_stocks_amount).toFixed(2)} ${no_spendable_item.unit}`,
					price_sell: `$ ${Number(no_spendable_item.price).toFixed(2)}`,
					price_cost: `$ ${Number(no_spendable_item.cost).toFixed(2)}`,
                    min_stock: `$ ${Number(no_spendable_item.min_stock).toFixed(2)}`,
                    mid_stock: `$ ${Number(no_spendable_item.mid_stock).toFixed(2)}`,
                    max_stock: `$ ${Number(no_spendable_item.max_stock).toFixed(2)}`,
					status: "NULL"})
		})
	}
	$: if (items) {
		itemsToList = spendable_itemsToList.concat(no_spendable_itemsToList)
	}
    $: console.log(itemsToList);
	$: rows = itemsToList
</script>

	<Storages bind:storage={storage} />

	{#if rows.length!=0}<DataTable size="short" title="Control de Inventario" sortable {headers} {rows} />{/if}