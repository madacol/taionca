<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import Accounts from "../components/Accounts.svelte";

	let account1;
	let account2;
	let currency1;
	let currency2;

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
<TextInput labelText="Monto a cambiar" placeholder="Ingrese el monto a cambiar..." />
<h3 class="icons">➤</h3>
<TextInput labelText="Monto a cambiado" placeholder="Ingrese el monto cambiado..." />
</div>

<div class="OnSameLine">
	<div>
		<Accounts orientation="vertical" bind:account={account1} bind:currency={currency1}/>
	</div>
	<div>
		<Accounts orientation="vertical" bind:account={account2} bind:currency={currency2}/>
	</div>
</div>

<TextInput labelText="Tasa" placeholder="Ingrese la tasa de cambio..." />

<TextArea labelText="Descripción" placeholder="Ingrese la descripción del cambio de moneda..." />

<Button>Enviar</Button>