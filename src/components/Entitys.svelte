<script>
	import SelectSearch from '../components/Select.svelte';

	export let entity;
	export let isMulti = false;
	export let default_entity;
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

	function setEntity(x) { entity = x}
	$: if (entitys.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		entitysToList = entitys.map(({ id_entity, name }) => {
			const entityToReturn = {value: id_entity, label: name}
			if(default_entity === id_entity){
				setEntity([entityToReturn])
			}
			
			return entityToReturn
		})
	}

</script>

<SelectSearch placeholder="Entidades..." bind:selected={entity} isMulti={isMulti} items={entitysToList} {default_entity} on:select on:change/>