<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput, InlineNotification } from "carbon-components-svelte";
	import Login32 from "carbon-icons-svelte/lib/Login32";
	import { goto } from '@sapper/app'
	import { session } from '../stores';
	import { api, apiFetch, checkPermissions } from '../functions';
    import { onMount } from 'svelte';
    import { PRESIDENT } from '../constants/PERMISSIONS';

	let username;
	let password;

	$: user_permissions = ($session && $session.permissions) || [];


    async function login(event){
		
		const user = await apiFetch("/api/user");
		$session = user.session;
		user_permissions = ($session && $session.permissions) || [];
		event.preventDefault();
		const result = await api.post("/api/public/login", {username, password});
		$session = result.session;
        password=null;
		goto(`${checkPermissions([PRESIDENT[1]], user_permissions) ? '/': '/attendance'}`);
    }

</script>
	<FluidForm on:submit={login}>
		<TextInput name="username" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={username}/>
	
		<PasswordInput labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button on:click={login} type=submit icon={Login32}>Iniciar sesión</Button>
	</FluidForm>