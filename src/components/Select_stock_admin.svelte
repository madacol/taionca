<script>
	import SelectSearch from '../components/Select.svelte';

	export let item;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get items, If needed
	 */

    // let items = [];
	// onMount(async ()=>{
	// 	const response = await fetch('/api/public/items');
	// 	items = await response.json();
	// })
	
	let itemsToList = [
	{value: 0, label: 'Papel'},
	{value: 1, label: 'Lapiz'},
	{value: 2, label: 'Bolígrafo'},
	{value: 3, label: 'Borrador'},
	{value: 4, label: 'Tinta'}
	];
	// $: if (items.length > 0) {
    //     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	// 	itemsToList = items.map(({id_item, name, created_at, amount, symbol}) => {
    //         const date=(new Date(created_at)).toLocaleString("es-ES",options);
    //         const item_amount=Number(amount).toFixed(2);
	// 		return ({value: id_item, label: `${id_item} | ${name} | ${symbol}.${item_amount} | ${date}`})
	// 	})
	// }

</script>

<SelectSearch placeholder="Articulos..." bind:selected={item} items={itemsToList}/>