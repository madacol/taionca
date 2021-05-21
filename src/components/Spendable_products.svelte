<script>
	import SelectSearch from '../components/Select.svelte';

	export let spendable_product;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get spendable_products, If needed
	 */

    let spendable_products = [];
    let spendable_productsToList = [];
	onMount(async ()=>{
		const response = await apiFetch('/api/public/spendable_products');
		spendable_products = await response.json();
	})

	$: if (spendable_products.length > 0) {
		spendable_productsToList = spendable_products.map(({ code }) => {
			return ({value: code, label: code})
		})
	}
</script>

<SelectSearch isCreatable="true" placeholder="Ingrese el código del artículo..." bind:selected={spendable_product} items={spendable_productsToList}/>