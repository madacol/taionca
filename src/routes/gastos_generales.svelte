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
	let accounts = [
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

	let odts = [
	{value: 'odt1', label: 'ODT1'},
	{value: 'odt2', label: 'ODT2'},
	{value: 'odt3', label: 'ODT3'}
	];

</script>

<TextInput labelText="Monto gastado" placeholder="Ingrese el monto del gasto..." />

<FormGroup legendText="Moneda">
	<RadioButtonGroup selected="dolar">
		<RadioButton labelText="Dólares $" value="dolar" />
		<RadioButton labelText="Bolívares Bs" value="bolivar" />
		<RadioButton labelText="Pesos COP" value="peso" />
		<RadioButton labelText="Euros €" value="euro" />
		<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
	</RadioButtonGroup>
</FormGroup>


<SelectSearch placeholder="Cuentas..." items={accounts}/>

<SelectSearch placeholder="ODTs..." items={odts}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

<Button>Enviar</Button>