<script>
	import 'carbon-components-svelte/css/white.css';
	import { Button, DatePickerInput, NumberInput, Tile } from "carbon-components-svelte";
	import { apiFetch, next_date } from '../functions';
	import Responsibilitys from '../components/Responsibilitys.svelte';
	import Users from '../components/Users.svelte';
	import { onMount } from 'svelte';

	let DatePicker;
	let start_date;
    let user;
    let responsibility;
	let times_remaining = 2147483647;
	
	onMount(async ()=>{
        if (!DatePicker) DatePicker = (await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte')).default;
	})

	async function add_recurrent_responsibility(){
		await apiFetch("/api/public/assign_responsibility",{
			method: 'POST',
			body: JSON.stringify({
				responsibility,
				user,
				start_date,
				times_remaining
			}),
			headers: {'Content-Type': 'application/json'}
		})
		cleanWindows()
	}

	function cleanWindows(){
		start_date = null;
		user = null;
		responsibility = null;
		times_remaining = 2147483647;
	}
	$:console.log(responsibility);
</script>

<Responsibilitys bind:responsibility={responsibility}/>
	
<Users bind:user={user}/>

{#if DatePicker}
	<svelte:component this={DatePicker} bind:value={start_date} datePickerType="single" locale={navigator.language} dateFormat="Y/m/d">
		<DatePickerInput placeholder="Fecha de inicio" invalid={new Date(start_date) <= new Date(new Date().toLocaleDateString())} invalidText="Debe ser una fecha futura"/>
	</svelte:component>
{/if}
	
{#if responsibility}
	<Tile>Próxima entrega de la responsabilidad: {next_date(start_date, responsibility.term, responsibility.days_to_repeat).toLocaleDateString()}</Tile>	
{/if}

<NumberInput label="Ingrese la cantidad de veces que esta responsabilidad se ejecutará, default = infinite" bind:value={times_remaining}/>

<Button on:click={add_recurrent_responsibility}>Enviar</Button>