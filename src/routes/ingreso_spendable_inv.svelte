<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import Spendable_products from '../components/spendable_products.svelte';
	import Brands from '../components/Brands.svelte';
    
	let description;
	let brand;
	let code;
	let cost;
	let price;
	let storage=1;

	async function add_item(){
		await fetch("/api/public/new_spendable_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: code.value,
				brand: brand.value,
				cost,
				price,
				storage,
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
	}
</script>

<Spendable_products bind:spendable_product={code} />

<Brands bind:brand={brand} />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<Button on:click={add_item}>Enviar</Button>