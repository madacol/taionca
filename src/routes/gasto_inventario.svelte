<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Brands from "../components/Brands.svelte";

	let articles = [
	{value: 'electrodo', label: 'Electrodo'},
	{value: 'discoesmeril', label: 'Disco de esmeril'},
	{value: 'oxigeno', label: 'Oxigeno'},
	{value: 'gas', label: 'Gas'},
	{value: 'electrododesnudo', label: 'Electrodo desnudo'},
	{value: 'electrodorecubierto', label: 'Electrodo recubierto'},
	{value: 'cintaaislante', label: 'Cinta Aislante'}
	];

	let odts = [
	{value: 'odt1', label: 'ODT1'},
	{value: 'odt2', label: 'ODT2'},
	{value: 'odt3', label: 'ODT3'}
	];

	let brand;

</script>

<SelectSearch placeholder="Artículos..." items={articles}/>

<Brands bind:brand={brand} />

<TextInput type="Number" labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." />

<SelectSearch placeholder="ODTs..." items={odts}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

<Button>Enviar</Button>