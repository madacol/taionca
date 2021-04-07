<script>
	import 'carbon-components-svelte/css/white.css';
	import {TextInput,  TextArea, Button} from "carbon-components-svelte";
	import Accounts from  "../components/Accounts.svelte";
	
	let account;
	let odt;
	let description;
	let amount;

	async function create_expense(){
		await fetch("/api/public/admin_expenses",{
			method: 'POST',
			body: JSON.stringify({
				id_account: account.id_account,
				id_currency: account.id_currency,
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

	<TextInput type="Number" labelText="Monto" placeholder="Ingrese el monto del gasto..." bind:value={amount}/>

	<Accounts orientation="vertical" bind:account={account}/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

	<Button on:click={create_expense}>Enviar</Button>