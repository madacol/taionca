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
	let items = [
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

<TextInput labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." />

<FormGroup legendText="Moneda">
	<RadioButtonGroup selected="dolar">
		<RadioButton labelText="Dólares $" value="dolar" />
		<RadioButton labelText="Bolívares Bs" value="bolivar" />
		<RadioButton labelText="Pesos COP" value="peso" />
		<RadioButton labelText="Euros €" value="euro" />
		<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
	</RadioButtonGroup>
</FormGroup>

<SelectSearch placeholder="Cuentas..." {items}/>

<TextInput labelText="Cliente" placeholder="Ingrese el cliente..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." />

<Button>Enviar</Button>