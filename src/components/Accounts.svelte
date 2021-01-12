<script>
    import Currency from "./Currency.svelte";
	import SelectSearch from '../components/Select.svelte';

	export let account;
	// export let currency;
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
	
	$: console.log(accounts, accountsToList);
	let accountsToList = [];
	$: if (accounts.length > 0) {
		console.log(accounts);
		accountsToList = accounts.map(({id_account, name, symbol}) => ({value: id_account, label: `${name} (${symbol})`}))
	}

</script>

<!-- <Currency bind:selectedCurrency={currency} {orientation}/> -->

<SelectSearch placeholder="Cuentas..." bind:selected={account} items={accountsToList}/>
