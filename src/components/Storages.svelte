<script>
	import SelectSearch from './Select.svelte';

	export let storage;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get storages, If needed
	 */

    let storages = [];
    let storagesToList = [];
	onMount(async ()=>{
		const response = await apiFetch('/api/public/storages');
		storages = await response.json();
	})

	$: if (storages.length > 0) {
		storagesToList = storages.map(({ name, id_storage }) => {
			return ({value: id_storage, label: name})
		})
	}

</script>

<SelectSearch placeholder="Almacén..." bind:selected={storage} items={storagesToList}/>