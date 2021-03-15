<script>
    import SelectSearch from '../components/Select.svelte';

	export let account;
	export let id_currency_filter = null;
	import { onMount } from 'svelte';
	
	/**
	 * Get accounts, If needed
	 */
	let accounts = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/accounts');
		accounts = await response.json();
	})

	let accountsToList = [];
	$: if (accounts.length > 0) {
		accountsToList = accounts
							.filter(({id_currency})=> id_currency_filter
														? id_currency === id_currency_filter
														: true
							).map((account) => {
								account.value=account.id_account
								account.label= `${account.name} (${account.symbol})`
								return account
							})
	}

</script>

<SelectSearch placeholder="Cuentas..." bind:selected={account} items={accountsToList}/>
