<style>

	.RadioButtons{
		flex-flow: column wrap;
	}

</style>

<script>
	import 'carbon-components-svelte/css/white.css';
	//import Select from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";
	let items = [
	{value: 'dolar', label: 'Dólares $'},
	{value: 'bolivar', label: 'Bolívares Bs'},
	{value: 'peso', label: 'Pesos COP'},
	{value: 'euro', label: 'Euros €'},
	{value: 'bitcoin', label: 'Bitcoin BTC'}
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

<FormGroup legendText="Cuenta">
	<RadioButtonGroup selected="cajachica">
			<RadioButton labelText="Caja Chica" value="cajachica" />
			<RadioButton labelText="Chase" value="chase" />
			<RadioButton labelText="BOD" value="bod" />
			<RadioButton labelText="Venezuela" value="venezuela" />
			<RadioButton labelText="Provincial" value="provincial" />
			<RadioButton labelText="Banesco" value="banesco" />
			<RadioButton labelText="Mercantil" value="mercantil" />
			<RadioButton labelText="Caja Chica" value="ajachica" />
			<RadioButton labelText="Chase" value="hase" />
			<RadioButton labelText="BOD" value="od" />
			<RadioButton labelText="Venezuela" value="enezuela" />
			<RadioButton labelText="Provincial" value="rovincial" />
			<RadioButton labelText="Banesco" value="anesco" />
			<RadioButton labelText="Mercantil" value="ercantil" />
	</RadioButtonGroup>
</FormGroup>

<TextInput labelText="Cliente" placeholder="Ingrese el cliente..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." />

<!-- <Select {items}/> -->