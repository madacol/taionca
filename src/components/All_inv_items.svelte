<script>
    import SelectSearch from '../components/Select.svelte';

	export let item;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get items, If needed
	 */
	let items;
	const groupBy = (item) => item.category;
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
			return ({value: spendable_item.spendable_products_code, 
					label: `Código: ${spendable_item.spendable_products_code} | Disponible: ${Number(spendable_item.spendable_stocks_amount).toFixed(2)}${spendable_item.unit} | Almacén: ${spendable_item.storages_name}`,
					category: 'consumibles',
					id: spendable_item.id_spendable_stock })
		})
	}

	$: if (items) {
		let no_spendable_items=items.no_spendable_stocks;
		no_spendable_itemsToList = no_spendable_items.map(( no_spendable_item ) => {
			return ({value: no_spendable_item.no_spendable_products_code, 
					label: `Código: ${no_spendable_item.no_spendable_products_code} | Disponible: ${Number(no_spendable_item.no_spendable_stocks_amount).toFixed(2)}${no_spendable_item.unit} | Almacén: ${no_spendable_item.storages_name}`,
					category: 'equipos y herramientas',
					id: no_spendable_item.id_no_spendable_stock })
		})
	}
	$: if (items) {
		itemsToList= spendable_itemsToList.concat(no_spendable_itemsToList)
	}
</script>

<SelectSearch placeholder="Artículos..." bind:selected={item} items={itemsToList} {groupBy}/>
