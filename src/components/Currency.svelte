<script>
	import {
		FormGroup,
		RadioButtonGroup,
		RadioButton,
	}
	from "carbon-components-svelte";

	export let selectedCurrency;
	/** @type {"vertical" | "horizontal"}*/
	export let orientation = "horizontal";

    import { onMount } from 'svelte';
	
	/**
	 * Get currencies, If needed
	 */
	let currencies;
	onMount(async ()=>{
		if (!currencies) {
			const response = await fetch('/api/public/currencies');
			currencies = await response.json();
		}
	})
</script>


<FormGroup legendText="Moneda">
	<RadioButtonGroup {orientation} bind:selected={selectedCurrency}>
		{#if currencies}
			{#each currencies as currency}
				<RadioButton labelText={`${currency.name_plural} ${currency.symbol}`} value={currency.id_currency} />	
			{/each}
		{/if}
	</RadioButtonGroup>
</FormGroup>