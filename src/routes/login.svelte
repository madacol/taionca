<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput, InlineNotification } from "carbon-components-svelte";
	import Login32 from "carbon-icons-svelte/lib/Login32";
	import { goto } from '@sapper/app'
	import { session } from '../stores';
	import { api, notify } from '../functions';

	let username;
	let password;
	let inicio_sesion=true;

    async function login(){
		// const response = await fetch("/api/public/login",{
		// 	method: 'POST',
		// 	body: JSON.stringify({
        //         username,
		// 		password
		// 	}),
		// 	headers: {'Content-Type': 'application/json'}
        // })
		// const result = await response.json();
		const result = await api.post("/api/public/login", {username, password});
		$session = result.session;
		if (!$session){
			inicio_sesion=false;
			console.log($session);
		}
		else{
			goto("/");
		}
        password=null
    }

 
</script>
	<FluidForm on:submit={login}>
		<TextInput name="username" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={username}/>
	
		<PasswordInput labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button type=submit icon={Login32}>Iniciar sesión</Button>
	</FluidForm>