<script>
    import 'carbon-components-svelte/css/white.css';
    import { Button, ContentSwitcher, Switch } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	// import Users from '../components/Users.svelte';
    
	// let user;
	let entry_time;
	let departure_time;
	let selectedIndex;
	
	function set_date(time){
		const year = new Date().getFullYear();
		const month = new Date().getMonth();
		const day = new Date().getDate();
		if(time){
			let hours = Number(time[0] + time[1]);
			let minutes = Number(time[3] + time[4]);
			return new Date(year, month, day, hours, minutes)//.toLocaleString();
		}else{
			return null;
		}

	}
	// $:console.log(set_date(entry_time)); //Hoy a las 8AM
	// $:console.log(set_date(departure_time)); //Hoy a las 6PM
	
	async function send_attendance(){
		
		await apiFetch("/api/public/attendance",{
			method: 'POST',
			body: JSON.stringify({ 
				// id_user_employee: user.value, 
				entry_date: set_date(entry_time), //Hora de llegada
				departure_date: set_date(departure_time) //Hora de salida
			}),
			headers: {'Content-Type': 'application/json'}
		})

		cleanWindows();
	}

	function cleanWindows(){
		entry_time = null;
		departure_time = null;
		// user = null;
	}
    
</script>

<ContentSwitcher bind:selectedIndex>
	<Switch text="Llegada"/>
	<Switch text="Salida"/>
	<Switch text="Ambos"/>
</ContentSwitcher>

<!-- <Users bind:user={user}/> -->

{#if selectedIndex===0 || selectedIndex===2}
<form>
	<label for="entry_time">Selecciona la hora de llegada:</label>
	<input id="entry_time" type="time" bind:value={entry_time}>
</form>	
{/if}

{#if selectedIndex===1 || selectedIndex===2}
<form>
	<label for="departure_time">Selecciona la hora de salida:</label>
	<input id="departure_time" type="time" bind:value={departure_time}>
</form>
{/if}

<Button on:click={send_attendance}>Enviar</Button>