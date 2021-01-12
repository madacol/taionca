<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Currency from "../components/Currency.svelte";

	let selectedCurrency;
	let contractAmount;
	let client;
	let description;

	function create_odt(){
		fetch("/api/public/odts",{
			method: 'POST',
			body: JSON.stringify({contractAmount, selectedCurrency, client, description}),
			headers: {'Content-Type': 'application/json'}
		})
	}
</script>


<TextInput labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." bind:value={contractAmount}/>

<Currency bind:selectedCurrency/>

<TextInput labelText="Cliente" placeholder="Ingrese el cliente..." bind:value={client}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." bind:value={description}/>

<Button on:click={create_odt}>Enviar</Button>