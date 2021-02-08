<script>
	import 'carbon-components-svelte/css/white.css';
	import { TextInput, Button, TextArea} from "carbon-components-svelte";
    
    let description;

</script>

<TextInput labelText="Código" placeholder="Ingrese el código del artículo..."/>

<TextInput labelText="Marca" placeholder="Ingrese la Marca..."/>

<TextInput type="Number" labelText="Cantidad" placeholder="Ingrese la cantidad..." />

<TextInput type="Number" labelText="Costo" placeholder="Ingrese el monto..." />

<TextInput type="Number" labelText="Precio de Venta" placeholder="Ingrese el monto..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del artículo..." bind:value={description}/>

<Button>Enviar</Button>