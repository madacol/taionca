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
  } 
  	from "carbon-components-svelte";

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

	let currency;

	$: account = ACCOUNTS[currency];
</script>

<TextInput labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." />

<FormGroup legendText="Moneda">
	<RadioButtonGroup bind:selected={currency}>
		<RadioButton labelText="Dólares $" value="dolar" />
		<RadioButton labelText="Bolívares Bs" value="bolivar" />
		<RadioButton labelText="Pesos COP" value="peso" />
		<RadioButton labelText="Euros €" value="euro" />
		<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
	</RadioButtonGroup>
</FormGroup>

<SelectSearch placeholder="Cuentas..." items={account}/>

<TextInput labelText="Cliente" placeholder="Ingrese el cliente..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." />

<Button>Enviar</Button>