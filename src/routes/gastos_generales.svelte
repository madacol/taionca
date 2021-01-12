<script context="module">
	export async function preload() {
        const response = await this.fetch('/api/public/currencies');
        const currencies = await response.json();
        return {
            currencies
        };
    }
</script>
<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let odts = [
	{value: 'odt1', label: 'ODT1'},
	{value: 'odt2', label: 'ODT2'},
	{value: 'odt3', label: 'ODT3'}
	];

	export let currencies;
	let account;
	let selectedCurrency;


</script>

<TextInput labelText="Monto gastado" placeholder="Ingrese el monto del gasto..." />

<Accounts bind:account bind:selectedCurrency {currencies}/>

<SelectSearch placeholder="ODTs..." items={odts}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

<Button>Enviar</Button>