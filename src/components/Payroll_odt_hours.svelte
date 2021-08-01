<script>
	import SelectSearch from '../components/Select.svelte';

	export let hours_by_odt;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get hours_by_odts, If needed
	 */

    let payroll_odt_hours = [];
    let payroll_odt_hoursToList = [];
	onMount(async ()=>{
		({payroll_odt_hours} = await apiFetch('/api/public/payroll_odt_hours'));
	})

	$: if (payroll_odt_hours.length > 0) {
		payroll_odt_hoursToList = payroll_odt_hours.map(( record ) => {
			return ({...record, value: record.id_payroll_odt_hour, label: `${record.name} ${record.lastname} | ODT: ${record.id_odt} | Horas: ${record.hours_spent}h`})
		})
	}

</script>

<SelectSearch placeholder="Usuarios..." bind:selected={hours_by_odt} isMulti items={payroll_odt_hoursToList}/>