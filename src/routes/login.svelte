<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput } from "carbon-components-svelte";
	import Login32 from "carbon-icons-svelte/lib/Login32";
	import { goto } from '@sapper/app'
	import { session } from '../stores';

	let username;
	let password;

    async function login(){
		const response = await fetch("/api/public/login",{
			method: 'POST',
			body: JSON.stringify({
                username,
				password
			}),
			headers: {'Content-Type': 'application/json'}
        })
		const result = await response.json();
		$session = result.session;
		if (!$session){
			alert(result.error)
		}
		else{
			alert(result.success)
			goto("/");
		}
        password=null
    }

 
</script>
	<FluidForm on:submit={login}>
		<TextInput name="username" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={username}/>
	
		<PasswordInput labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button type=submit on:click={login} icon={Login32}>Iniciar sesión</Button>
	</FluidForm>