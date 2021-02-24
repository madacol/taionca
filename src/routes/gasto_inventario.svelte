<script>
	import 'carbon-components-svelte/css/white.css';
	import { Button, TextInput, TextArea } from "carbon-components-svelte";
	import SelectSearch from '../components/Select.svelte';
	import All_inv_items from '../components/All_inv_items.svelte';
	import Odts from "../components/Odts.svelte";

	let amount;
	let item;
	let description;
	let odt;
	let api;
	
	async function create_expense(api){
		const response = await fetch(`${api}`,{
			method: 'POST',
			body: JSON.stringify({
				id_spendable_stock: item.id,
				amount,
				id_odt: odt.value,
				description
			}),headers: {'Content-Type': 'application/json'}
		});
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		item=null
		amount=null
		odt=null
		description=""
	}

	function apiType(){
		if (item.category==="consumibles"){
			api="/api/public/spendable_inv_odt_expenses"
			create_expense(api)
		}else{
			api="/api/public/no_spendable_inv_odt_expenses"
			create_expense(api)
		}
	}

</script>

<All_inv_items bind:item={item}/>

<TextInput type="Number" labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." bind:value={amount}/>

<Odts bind:odt={odt}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." bind:value={description}/>

<Button on:click={apiType}>Enviar</Button>