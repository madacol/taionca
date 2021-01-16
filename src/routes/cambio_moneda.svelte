<script>
	import { Button, TextArea, Tile, TextInput } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import Accounts from "../components/Accounts.svelte";

	let account_expense;
	let account_income;
	let currency_expense;
	let currency_income;
	let exchange_rate = "";
	let amount_expense;
	let amount_income;
	let description;
	let evidence="Supuesta evidencia";

	$: {
		exchange_rate= (amount_expense/amount_income) || ""
		if(exchange_rate<=1){
			exchange_rate=1/exchange_rate;
		}
	}

	function create_exchange_currency(){

		fetch("/api/public/exchange_currency",{
			method: 'POST',
			body: JSON.stringify({
				description,
				expense: {
					id_account: account_expense.value,
					amount: amount_expense,
					description,
					evidence,
					movement_category: 'currencyChanges'
				},
				income: {
					id_account: account_income.value,
					amount: amount_income,
					description,
					movement_category: 'currencyChanges'
				}
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
		amount_income=null
		account_income=null
		currency_income=null
		description=""
	}
</script>

<style>
	.OnSameLine{
		display: flex;
		justify-content: space-around;
	}

	.OnSameLine > :global(*){
		width: 100%;
	}

	.icons{
		font-size: 2rem;
		line-height: 2.5;
		width: 1em;
	}
</style>

<div class="OnSameLine">
<TextInput type="number" labelText="Monto a cambiar" placeholder="Ingrese el monto a cambiar..." bind:value={amount_expense} />
<h3 class="icons">➤</h3>
<TextInput type="number" labelText="Monto a cambiado" placeholder="Ingrese el monto cambiado..." bind:value={amount_income} />
</div>

<div class="OnSameLine">
	<div>
		<Accounts orientation="vertical" bind:account={account_expense} bind:currency={currency_expense}/>
	</div>
	<div>
		<Accounts orientation="vertical" bind:account={account_income} bind:currency={currency_income}/>
	</div>
</div>

<Tile>Tasa: {exchange_rate}</Tile>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del cambio de moneda..." bind:value={description}/>

<Button on:click={create_exchange_currency}>Enviar</Button>