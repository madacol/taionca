<script>
	import 'carbon-components-svelte/css/white.css';
	import { FluidForm, TextInput, Button, PasswordInput } from "carbon-components-svelte";
	import Login32 from "carbon-icons-svelte/lib/Login32";

	let username;
	let password;

    async function login(){
		await fetch("/api/public/login",{
			method: 'POST',
			body: JSON.stringify({
                username,
				password
			}),
			headers: {'Content-Type': 'application/json'}
        })
        username=null
        password=null
    }

    function logout(){
		fetch("/api/user", {
			method: "DELETE"
		})
	}
</script>
	<FluidForm>
		<TextInput type="user" labelText="Usuario" placeholder="Ingrese su usuario..." bind:value={username}/>
	
		<PasswordInput type="password" labelText="Contraseña" placeholder="Ingrese su contraseña..." bind:value={password}/>

		<Button on:click={login} icon={Login32}>Iniciar sesión</Button>
		<Button on:click={logout} >Cerrar sesión</Button>
	</FluidForm>