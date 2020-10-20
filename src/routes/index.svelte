<script>
	import Select from '../components/Select.svelte';
	let items = [
	{value: 'dolar', label: 'Dólares $'},
	{value: 'bolivar', label: 'Bolívares Bs'},
	{value: 'peso', label: 'Pesos COP'},
	{value: 'euro', label: 'Euros €'},
	{value: 'bitcoin', label: 'Bitcoin BTC'}
];
</script>

<Select {items}/>