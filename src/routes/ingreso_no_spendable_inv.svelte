<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import No_spendable_products from '../components/No_spendable_products.svelte';
	import Brands from '../components/Brands.svelte';
    
	let description;
	let brand;
	let code;
	let cost;
	let price;

	async function add_item(){
		await fetch("/api/public/new_no_spendable_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: code.value,
				brand: brand.value,
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
	}
</script>

<No_spendable_products bind:no_spendable_product={code} />

<Brands bind:brand={brand} />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<Button on:click={add_item}>Enviar</Button>