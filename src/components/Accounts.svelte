<script>
    import Currency from "./Currency.svelte";
	import SelectSearch from '../components/Select.svelte';

	export let account;
	export let currency;
	/** @type {"vertical" | "horizontal"}*/
	export let orientation = "horizontal";

    const ACCOUNTS = {
		dolar: [
		{value: 'cajachica', label: 'Caja Chica'},
		{value: 'chase', label: 'Chase'},
		{value: 'revolut', label: 'Revolut'}
		],

		bolivar: [
		{value: 'cajachica', label: 'Caja Chica'},
		{value: 'bod', label: 'Bod'},
		{value: 'venezuela', label: 'Venezuela'},
		{value: 'provincial', label: 'Provincial'},
		{value: 'banesco', label: 'Banesco'},
		{value: 'mercantil', label: 'Mercantil'}
		],

		peso: [
		{value: 'cajachica', label: 'Caja Chica'},
		{value: 'davivienda', label: 'Davivienda'}
		],

		euro: [
		{value: 'cajachica', label: 'Caja Chica'},
		{value: 'revolut', label: 'Revolut'}
		],

		bitcoin: [
		{value: 'btc', label: 'Bitcoin'}
		]
    }



	$: account = ACCOUNTS[currency];
</script>

<Currency bind:currency {orientation}/>

<SelectSearch placeholder="Cuentas..." items={account}/>
