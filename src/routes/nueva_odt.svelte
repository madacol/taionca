<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Currency from "../components/Currency.svelte";
	import Clients from "../components/Clients.svelte";

	let selectedCurrency;
	let contractAmount;
	let client = null;
	let description;

	async function create_odt(){
		await fetch("/api/public/nueva_odt",{
			method: 'POST',
			body: JSON.stringify({
				contractAmount,
				id_currency: selectedCurrency.id_currency,
				id_client: client.value,
				description
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		contractAmount=null
		client=null
		description=""
	}
</script>


<TextInput type="number"labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." bind:value={contractAmount}/>

<Currency bind:selectedCurrency/>

<Clients bind:client={client}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." bind:value={description}/>

<Button on:click={create_odt}>Enviar</Button>