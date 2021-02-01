<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput } from "carbon-components-svelte";

	let user;
	let password;

	function login(){
		console.log(user)
		console.log(password)
		user=""
		password=""
	}
</script>
	<FluidForm>
		<TextInput type="user" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={user}/>
	
		<PasswordInput type="password" labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button on:click={login}>Iniciar sesión</Button>
	</FluidForm>