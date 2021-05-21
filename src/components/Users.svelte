<script>
	import SelectSearch from '../components/Select.svelte';

	export let user;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get users, If needed
	 */
    let usersToList = [];
	onMount(async ()=>{
		const response = await apiFetch('/api/users');
		const {users} = await response.json();
        usersToList = users.map(({ name, user_id }) => {
            return ({value: user_id, label: name})
        })
	})

</script>

<SelectSearch placeholder="Usuarios..." bind:selected={user} items={usersToList}/>