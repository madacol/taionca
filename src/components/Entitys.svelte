<script>
	import SelectSearch from '../components/Select.svelte';

	export let entity;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get entitys, If needed
	 */

    let entitysToList = [];
    let entitys = [];
	onMount(async ()=>{
		 ({entitys} = await apiFetch ('/api/public/entitys'));
	})

	$: if (entitys.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		entitysToList = entitys.map(({ id_entity, name }) => {
			return ({value: id_entity, label: name})
		})
	}

</script>

<SelectSearch placeholder="Entidades..." bind:selected={entity} items={entitysToList}/>