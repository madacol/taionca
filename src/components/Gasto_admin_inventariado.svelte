<script>
	import 'carbon-components-svelte/css/white.css';
	import {Button, TextInput} from "carbon-components-svelte";
    import SelectStockAdmin from './Select_stock_admin.svelte';
    
    let item;
    
</script>	

    <SelectStockAdmin orientation="vertical" bind:item={item}/>
    <TextInput labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." />
    <Button>Enviar</Button>