<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import Spendable_products from '../components/Spendable_products.svelte';
	import Measures from '../components/Measures.svelte';
	import Storages from '../components/Storages.svelte';
	import Brands from '../components/Brands.svelte';
    
	let description;
	let brand;
	let code;
	let cost;
	let price;
	let measure;
	let storage;

	async function add_item(){
		await fetch("/api/public/new_spendable_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: code.value,
				brand: brand.value,
				measure: measure.value,
				storage: storage.value,
				cost,
				price,
				description
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
		alert("Los datos han sido registrados")
	}

	function cleanWindows(){
		description=""
		brand=null
		code=null
		cost=null
		price=null
		measure=null
		storage=null
	}
</script>

<Spendable_products bind:spendable_product={code} />

<Brands bind:brand={brand} />

<Measures bind:measure={measure} />

<Storages bind:storage={storage} />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<Button on:click={add_item}>Enviar</Button>