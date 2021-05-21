<script>
	import SelectSearch from './Select.svelte';

	export let measure;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get measures, If needed
	 */

    let measures = [];
    let measuresToList = [];
	onMount(async ()=>{
		const response = await apiFetch('/api/public/measures');
		measures = await response.json();
	})

	$: if (measures.length > 0) {
		measuresToList = measures.map(({ name, id_measure }) => {
			return ({value: id_measure, label: name})
		})
	}

</script>

<SelectSearch placeholder="Unidades de medición..." bind:selected={measure} items={measuresToList}/>