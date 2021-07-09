<script>
	import { DatePickerInput, NumberInput, Tile } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
	import TimeFrequency from '../components/time_frequency.svelte';
	import { next_date } from '../functions';
	
	let DatePicker;
	let deadline;
	let time_frequency;
	let days_to_repeat;
	
	onMount(async ()=>{
        if (!DatePicker) DatePicker = (await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte')).default;
	})

	let a;

	$: if(deadline && time_frequency){
		console.log(deadline, time_frequency.term, days_to_repeat);
		a = next_date(deadline, time_frequency.term, days_to_repeat).toLocaleDateString();
	}
</script>

{#if DatePicker}
	<svelte:component this={DatePicker} bind:value={deadline} datePickerType="single" locale={navigator.language} dateFormat="Y/m/d">
		<DatePickerInput placeholder="Fecha de inicio" invalid={new Date(deadline) <= new Date(new Date().toLocaleDateString())} invalidText="Debe ser una fecha futura"/>
	</svelte:component>
{/if}

<TimeFrequency bind:time_frequency={time_frequency} />

{#if time_frequency && time_frequency.value === 'every x days'}

    <NumberInput allowEmpty label="Ingrese la cantidad de días" invalid = { days_to_repeat <= 1 } invalidText = "Número fuera de rango" placeholder="Ingrese la cantidad de días" bind:value={days_to_repeat}/>

{/if}

<Tile>Próxima entrega de la responsabilidad: {a}</Tile>

