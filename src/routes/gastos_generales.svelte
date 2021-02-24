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
	import 'carbon-components-svelte/css/white.css';
	import Odts from '../components/Odts.svelte';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let currency_expense;
	let account_expense;
	let odt;
	let description;
	let amount_expense;
	let evidence="Supuesta evidencia";

	async function create_expense(){
		await fetch("/api/public/expenses",{
			method: 'POST',
			body: JSON.stringify({
				id_movement_category: odt.value,
				id_account: account_expense.id_account,
				amount: amount_expense,
				description,
				evidence,
				movement_category: 'odts'

			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		amount_expense=null
		account_expense=null
		currency_expense=null
		odt=null
		description=""
	}

</script>

<TextInput type="Number" labelText="Monto gastado" placeholder="Ingrese el monto del gasto..." bind:value={amount_expense}/>

<Accounts orientation="vertical" bind:account={account_expense} bind:currency={currency_expense}/>

<Odts bind:odt={odt}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

<Button on:click={create_expense}>Enviar</Button>