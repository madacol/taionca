<script>
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import Accounts from "../components/Accounts.svelte";
	import { TextInput, Button} from "carbon-components-svelte";

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

	let brands = [
	{value: '1', label: 'Hoffman'},
	{value: '2', label: 'Lincoln'}
    ];
    
    let account;
    let currency;

</script>

<SelectSearch placeholder="Artículos..." items={articles}/>

<SelectSearch placeholder="Marca..." items={brands}/>

<TextInput type="Number" labelText="Cantidad repuesta" placeholder="Ingrese la cantidad repuesta..." />

<TextInput type="Number" labelText="Monto gastado" placeholder="Ingrese el monto gastado..." />

<Accounts orientation="vertical" bind:account={account} bind:currency={currency}/>


<Button>Enviar</Button>