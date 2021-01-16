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
	import Accounts from "../components/Accounts.svelte";

	let opts;

	let articles = [
	{value: 'electrodo', label: 'Electrodo'},
	{value: 'discoesmeril', label: 'Disco de esmeril'},
	{value: 'oxigeno', label: 'Oxigeno'},
	{value: 'gas', label: 'Gas'},
	{value: 'electrododesnudo', label: 'Electrodo desnudo'},
	{value: 'electrodorecubierto', label: 'Electrodo recubierto'},
	{value: 'cintaaislante', label: 'Cinta Aislante'}
	];

	let pays = [
	{value: 'pago1', label: 'Pagos a Marisol'},
	{value: 'pago2', label: 'Pagos a IVA'},
	{value: 'pago3', label: 'Pagos a Alcaldía'},
	{value: 'pago4', label: 'Pagos a IVSS'},
	{value: 'pago5', label: 'Pagos a INPSASEL'}
	];

	let account;
	let currency;

</script>

<FormGroup legendText="Tipo de gasto">
	<RadioButtonGroup bind:selected={opts}>
		<RadioButton labelText="Inventariado" value="inventoried" />
		<RadioButton labelText="Recurrentes" value="recurrent" />
		<RadioButton labelText="Otros" value="others" />
	</RadioButtonGroup>
</FormGroup>

{#if opts==="inventoried"}

	<SelectSearch placeholder="Artículos..." items={articles}/>
	<TextInput labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." />

{:else if opts==="recurrent"}

	<SelectSearch placeholder="Transacciones..." items={pays}/>

{:else if opts==="others"}

	<TextInput labelText="Nombre de Gasto" placeholder="Ingrese la nombre del gasto..." />
	<TextInput labelText="Monto" placeholder="Ingrese el monto del gasto..." />

	<Accounts bind:account bind:currency/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

{/if}

<Button>Enviar</Button>