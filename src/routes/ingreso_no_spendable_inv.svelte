<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea } from "carbon-components-svelte";
	import No_spendable_products from '../components/No_spendable_products.svelte';
	import Brands from '../components/Brands.svelte';
	import Measures from '../components/Measures.svelte';
	import Storages from '../components/Storages.svelte';
    
	let min;
	let mid;
	let top;
	let description;
	let brand;
	let code;
	let cost;
	let price;
	let storage;
	let measure;

	async function add_item(){
		await fetch("/api/public/new_no_spendable_item_product_brand",{
			method: 'POST',
			body: JSON.stringify({
				code: code.value,
				brand: brand.value,
				measure: measure.value,
				storage: storage.value,
				cost,
				price,
				min_stock: min,
				mid_stock: mid,
				max_stock: top,
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

<No_spendable_products bind:no_spendable_product={code} />

<Brands bind:brand={brand} />

<Measures bind:measure={measure} />

<Storages bind:storage={storage} />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." bind:value={cost}/>

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." bind:value={price}/>

<TextInput type="Number" labelText="Cantidad mínima de stock" placeholder="Ingrese el monto..." bind:value={min}/>

<TextInput type="Number" labelText="Cantidad media de stock" placeholder="Ingrese el monto..." bind:value={mid}/>

<TextInput type="Number" labelText="Cantidad máxima de stock" placeholder="Ingrese el monto..." bind:value={top}/>

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<Button on:click={add_item}>Enviar</Button>