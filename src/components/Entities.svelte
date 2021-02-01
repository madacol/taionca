<script>
	import SelectSearch from '../components/Select.svelte';

	export let entity;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get entities, If needed
	 */

    // let entities = [];
	// onMount(async ()=>{
	// 	const response = await fetch('/api/public/entities');
	// 	entities = await response.json();
	// })
	
	let entitiesToList = [
       {value: 0,label:"Taionca"},
       {value: 1,label:"Administración"},
       {value: 2,label:"Inventario"},
       {value: 3,label:"ODTs"}
    ]; //Temporal until I finish the database


	// $: if (entities.length > 0) {
    //     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	// 	entitiesToList = entities.map(({id_entity, name, created_at, amount, symbol}) => {
    //         const date=(new Date(created_at)).toLocaleString("es-ES",options);
    //         const entity_amount=Number(amount).toFixed(2);
	// 		return ({value: id_entity, label: `${id_entity} | ${name} | ${symbol}.${entity_amount} | ${date}`})
	// 	})
	// }

</script>

<SelectSearch placeholder="Entidades..." bind:selected={entity} items={entitiesToList}/>