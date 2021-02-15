<script>
	import SelectSearch from '../components/Select.svelte';

	export let no_spendable_product;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get no_spendable_products, If needed
	 */

    let no_spendable_products = [];
    let no_spendable_productsToList = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/no_spendable_products');
		no_spendable_products = await response.json();
	})

	$: if (no_spendable_products.length > 0) {
		no_spendable_productsToList = no_spendable_products.map(({ code }) => {
			return ({value: code, label: code})
		})
	}
</script>

<SelectSearch isCreatable="true" placeholder="Ingrese el código del artículo..." bind:selected={no_spendable_product} items={no_spendable_productsToList}/>