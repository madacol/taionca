<script>
	import SelectSearch from '../components/Select.svelte';

	export let entity;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get entitiys, If needed
	 */

    let entitiysToList = [];
    let entitiys = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/entitys');
		entitiys = await response.json();
	})

	$: if (entitiys.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		entitiysToList = entitiys.map(({ id_entity, name }) => {
			return ({value: id_entity, label: name})
		})
	}

</script>

<SelectSearch placeholder="Entidades..." bind:selected={entity} items={entitiysToList}/>