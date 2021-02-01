<script>
    import SelectSearch from '../components/Select.svelte';

	export let account;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	
	/**
	 * Get accounts, If needed
	 */
	let accounts = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/accounts');
		accounts = await response.json();
	})
	
	$: console.log(account, accountsToList);
	let accountsToList = [];
	$: if (accounts.length > 0) {
		console.log(accounts);
		accountsToList = accounts.map((account) => {
			account.value=account.id_account
			account.label= `${account.name} (${account.symbol})`
			return account
		})

	}

</script>

<SelectSearch placeholder="Cuentas..." bind:selected={account} items={accountsToList}/>
