<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let pays = [
	{value: 'pago1', label: 'Pagos a Marisol'},
	{value: 'pago2', label: 'Pagos a IVA'},
	{value: 'pago3', label: 'Pagos a Alcaldía'},
	{value: 'pago4', label: 'Pagos a IVSS'},
	{value: 'pago5', label: 'Pagos a INPSASEL'}
	];

	let odts = [
	{value: 'odt1', label: 'ODT1'},
	{value: 'odt2', label: 'ODT2'},
	{value: 'odt3', label: 'ODT3'}
	];

	let account;
	let currency;

</script>

<TextInput labelText="Monto gastado" placeholder="Ingrese el monto del gasto..." />

<Accounts bind:account bind:currency/>

<SelectSearch placeholder="ODTs..." items={odts}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

<Button>Enviar</Button>