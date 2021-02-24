<script>
	import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
	import { TextInput, TextArea, Button } from "carbon-components-svelte";
	import Clients from "../components/Clients.svelte";
	import Currency from "../components/Currency.svelte";

	let amount;
	let client = null;
	let description;
	let id_entity=1;
	let id_user;
	let currency;
	
	onMount(async ()=>{
		const response = await fetch('/api/users');
		const user = await response.json();
		id_user=user.users[0].user_id
	})
	
	
	async function create_odt(){
		await fetch("/api/public/nueva_odt",{
			method: 'POST',
			body: JSON.stringify({
				id_client: client.value,
				id_currency: currency.id_currency,
				id_entity,
				id_user,
				amount,
				description
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		amount=null
		client=null
		description=""
	}
</script>

<TextInput type="number"labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." bind:value={amount}/>

<Currency bind:currency={currency}/>

<Clients bind:client={client}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." bind:value={description}/>

<Button on:click={create_odt}>Enviar</Button>