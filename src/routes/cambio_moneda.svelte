<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";

	let currencies = [
	{value: 'dolar', label: 'Dólares $'},
	{value: 'bolivar', label: 'Bolívares Bs'},
	{value: 'peso', label: 'Pesos COP'},
	{value: 'euro', label: 'Euros €'},
	{value: 'bitcoin', label: 'Bitcoin BTC'}
	];

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

	let currency1;
	let currency2;

	$: account1 = ACCOUNTS[currency1];
	$: account2 = ACCOUNTS[currency2];

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
	<FormGroup legendText="Moneda">
		<RadioButtonGroup orientation="vertical" bind:selected={currency1}>
			<RadioButton labelText="Dólares $" value="dolar" />
			<RadioButton labelText="Bolívares Bs" value="bolivar" />
			<RadioButton labelText="Pesos COP" value="peso" />
			<RadioButton labelText="Euros €" value="euro" />
			<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
		</RadioButtonGroup>
	</FormGroup>
	<FormGroup legendText="Moneda">
		<RadioButtonGroup orientation="vertical" bind:selected={currency2}>
			<RadioButton labelText="Dólares $" value="dolar" />
			<RadioButton labelText="Bolívares Bs" value="bolivar" />
			<RadioButton labelText="Pesos COP" value="peso" />
			<RadioButton labelText="Euros €" value="euro" />
			<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
		</RadioButtonGroup>
	</FormGroup>
</div>
<div class="OnSameLine">
	<SelectSearch placeholder="Cuentas..." items={account1}/>
	<SelectSearch placeholder="Cuentas..." items={account2}/>
</div>

<TextInput labelText="Tasa" placeholder="Ingrese la tasa de cambio..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del cambio de moneda..." />

<Button>Enviar</Button>