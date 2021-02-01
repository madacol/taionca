<script>
	import { Button, TextArea, TextInput } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import Accounts from "../components/Accounts.svelte";
	import Entities from "../components/Entities.svelte";

	let account;
	let currency;
	let amount;
	let description;
	let entity;

	function create_request_exchange_currency(){
		alert("It works");
	}

</script>

<TextInput type="number" labelText="Monto necesitado" placeholder="Ingrese el monto..." bind:value={amount}/>

<Accounts orientation="vertical" bind:account={account} bind:currency={currency}/>

<Entities orientation="vertical" bind:entity={entity}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del cambio de moneda..." bind:value={description}/>

<Button on:click={create_request_exchange_currency}>Enviar</Button>