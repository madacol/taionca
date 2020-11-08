<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";

	let currency = [
	{value: 'dolar', label: 'Dólares $'},
	{value: 'bolivar', label: 'Bolívares Bs'},
	{value: 'peso', label: 'Pesos COP'},
	{value: 'euro', label: 'Euros €'},
	{value: 'bitcoin', label: 'Bitcoin BTC'}
	];

	let account = [
	{value: 'cajachica', label: 'Caja Chica'},
	{value: 'chase', label: 'Chase'},
	{value: 'bod', label: 'Bod'},
	{value: 'venezuela', label: 'Venezuela'},
	{value: 'provincial', label: 'Provincial'},
	{value: 'banesco', label: 'Banesco'},
	{value: 'mercantil', label: 'Mercantil'},
	{value: 'davivienda', label: 'Davivienda'},
	{value: 'revolut', label: 'Revolut'},
	{value: 'btc', label: 'Bitcoin'}
	];

</script>

<style>
	.OnSameLine{
		display: flex;
		justify-content: space-around;
	}

	.OnSameLine > :global(*){
		width: 100%;
	}

	.icons{
		font-size: 2rem;
		line-height: 2.5;
		width: 1em;
	}
</style>

<div class="OnSameLine">
<TextInput labelText="Monto a cambiar" placeholder="Ingrese el monto a cambiar..." />
<h3 class="icons">➤</h3>
<TextInput labelText="Monto a cambiado" placeholder="Ingrese el monto cambiado..." />
</div>

<div class="OnSameLine">
	<SelectSearch placeholder="Moneda..." items={currency}/>
	<SelectSearch placeholder="Moneda..." items={currency}/>
</div>
<div class="OnSameLine">
	<SelectSearch placeholder="Cuentas..." items={account}/>
	<SelectSearch placeholder="Cuentas..." items={account}/>
</div>

<TextInput labelText="Tasa" placeholder="Ingrese la tasa de cambio..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del cambio de moneda..." />

<Button>Enviar</Button>