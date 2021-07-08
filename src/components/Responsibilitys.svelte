<script>
	import SelectSearch from '../components/Select.svelte';

	export let responsibility;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get responsibilitys, If needed
	 */

    let responsibilitys = [];
    let responsibilitysToList = [];
	onMount(async ()=>{
		({responsibilitys} = await apiFetch('/api/public/responsibilitys'));
	})

	$: if (responsibilitys.length > 0) {
		responsibilitysToList = responsibilitys.map((responsibility) => {
			return ({...responsibility, value: responsibility.name, label: `${responsibility.name} | Importancia: ${responsibility.importance}`})
		})
	}

</script>

<SelectSearch isCreatable="true" placeholder="Responsabilidades..." bind:selected={responsibility} items={responsibilitysToList}/>