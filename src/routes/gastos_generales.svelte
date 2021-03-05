<script>
	import 'carbon-components-svelte/css/white.css';
	import Odts from '../components/Odts.svelte';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let account;
	let odt;
	let description;
	let amount;

	async function create_expense(){
		await fetch("/api/public/general_expenses",{
			method: 'POST',
			body: JSON.stringify({
				id_account: account.id_account,
				id_odt: odt.value,
				amount,
				description,

			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		amount=null
		account=null
		odt=null
		description=""
	}
</script>

<TextInput type="Number" labelText="Monto gastado" placeholder="Ingrese el monto del gasto..." bind:value={amount}/>

<Accounts orientation="vertical" bind:account={account}/>

<Odts bind:odt={odt}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

<Button on:click={create_expense}>Enviar</Button>