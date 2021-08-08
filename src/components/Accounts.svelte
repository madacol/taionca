<script>
    import SelectSearch from '../components/Select.svelte';

	export let account;
	export let id_currency_filter = null;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get accounts, If needed
	 */
	let accounts = [];
	onMount(async ()=>{
		({accounts} = await apiFetch('/api/public/accounts'));
		get_accounts ();
	})

	let accountsToList = [];
	function get_accounts (){
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

<SelectSearch placeholder="Cuentas..." bind:selected={account} on:change={get_accounts} items={accountsToList}/>
