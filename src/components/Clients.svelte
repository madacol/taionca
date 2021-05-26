<script>
	import SelectSearch from '../components/Select.svelte';

	export let client;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get clients, If needed
	 */
	let clients = [];
	onMount(async ()=>{
		 ({clients} = await apiFetch('/api/public/clients'));
	})
	
	let clientsToList = [];
	$: if (clients.length > 0) {
		clientsToList = clients.map(({id_client, name}) => ({value: id_client, label: name}))
	}

</script>

<SelectSearch placeholder="Clientes..." bind:selected={client} items={clientsToList}/>
