<script>
	import SelectSearch from '../components/Select.svelte';

	export let brand;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get brands, If needed
	 */

    let brands = [];
    let brandsToList = [];
	onMount(async ()=>{
		({brands} = await apiFetch('/api/public/brands'));
	})

	$: if (brands.length > 0) {
		brandsToList = brands.map(({ name }) => {
			return ({value: name, label: name})
		})
	}

</script>

<SelectSearch isCreatable="true" placeholder="Marcas..." bind:selected={brand} items={brandsToList}/>