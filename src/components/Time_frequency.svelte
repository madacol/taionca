<script>
	import SelectSearch from './Select.svelte';

	export let time_frequency;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
import About from '../routes/about.svelte';
	
	/**
	 * Get time_frequencys, If needed
	 */

    let time_frequencys = [];
    let time_frequencysToList = [];
	onMount(async ()=>{
		({time_frequencys} = await apiFetch('/api/public/time_frequencys'));
	})

	$: if (time_frequencys.length > 0) {
		time_frequencysToList = time_frequencys.map(( time_frequency ) => {
			return ({...time_frequency, value: time_frequency.term, label: time_frequency.term_label })
		})
	}

</script>

<SelectSearch  placeholder="Periodo..." bind:selected={time_frequency} items={time_frequencysToList}/>