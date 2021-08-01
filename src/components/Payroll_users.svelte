<script>
	import SelectSearch from '../components/Select.svelte';

	export let payroll_user;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get payroll_users, If needed
	 */

    let payroll_not_assign_hours = [];
    let payroll_not_assign_hoursToList = [];
	onMount(async ()=>{
		({payroll_not_assign_hours} = await apiFetch('/api/public/payroll_not_assign_hours'));
	})

	$: if (payroll_not_assign_hours.length > 0) {
		payroll_not_assign_hoursToList = payroll_not_assign_hours.map(( user ) => {
			return ({...user, value: user.id_user, label: `${user.name} ${user.lastname} | Horas: ${user.hours}h`})
		})
	}

</script>

<SelectSearch placeholder="Usuarios..." bind:selected={payroll_user} items={payroll_not_assign_hoursToList}/>