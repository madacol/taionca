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
		const {users} = await apiFetch('/api/users');
        usersToList = users.map(({ name, user_id }) => {
            return ({value: user_id, label: name})
        })
	})

</script>

<SelectSearch bind:selected={user} items={usersToList} isClearable={false} selectedValue="Usuarios..."/>