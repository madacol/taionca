<script>
	import 'carbon-components-svelte/css/white.css';
	import {TextInput,  TextArea, Button} from "carbon-components-svelte";
	import Accounts from  "../components/Accounts.svelte";

	let account;
	let currency;
	let amount;
	let description;
	let evidence="Supuesta Evidencia";
	
	async function create_expense(){
		fetch("/api/public/adminExpenses",{
			method: 'POST',
			body: JSON.stringify({
				description,
				expense: {
					id_account: account.id_account,
					amount,
					description,
					evidence,
					movement_category: 'adminExpenses'
				}
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		amount=null
		account=null
		currency=null
		description=""
	}
</script>	

	<TextInput type="Number" labelText="Monto" placeholder="Ingrese el monto del gasto..." bind:value={amount}/>
	<Accounts orientation="vertical" bind:account={account} bind:currency={currency}/>
	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>
	<Button on:click={create_expense}>Enviar</Button>