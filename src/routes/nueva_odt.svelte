<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let account;
	let currency;

</script>

<TextInput labelText="Monto de contrato" placeholder="Ingrese el monto del contrato..." />

<Accounts bind:account bind:currency/>

<TextInput labelText="Cliente" placeholder="Ingrese el cliente..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del trabajo..." />

<Button>Enviar</Button>