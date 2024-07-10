<script>
    import SelectSearch from '../components/Select.svelte';

	export let account;
	export let id_currency_filter = null;
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';

	export let isMulti = false;
	export let default_account;

	
	/**
	 * Get accounts, If needed
	 */
	let accounts = [];
	onMount(async ()=>{
		({accounts} = await apiFetch('/api/public/accounts'));
		get_accounts ();
	})

	let accountsToList = [];
	function setAccount(x) { account = x}
	function get_accounts (){
		accountsToList = accounts.filter(({id_currency})=> id_currency_filter
														? id_currency === id_currency_filter
														: true
							).map((account) => {
								const accountToReturn = {...account, value: account.id_account, label: `${account.name} (${account.symbol})`}
								if(default_account === account.id_account){
									setAccount([accountToReturn])
								}
								
								return accountToReturn

								// account.value=account.id_account
								// account.label= `${account.name} (${account.symbol})`
								// return account
							})
	}
</script>

<SelectSearch on:select placeholder="Cuentas..." bind:selected={account} on:change={get_accounts} items={accountsToList} isMulti={isMulti} {default_account}/>
