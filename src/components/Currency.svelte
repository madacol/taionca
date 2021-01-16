<script>
	import {
		FormGroup,
		RadioButtonGroup,
		RadioButton,
	}
	from "carbon-components-svelte";

	export let selectedCurrency = null;
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
		if( screen.width <= 480 ) {
			orientation="vertical"
			// is mobile
		}
	})
		

</script>

<FormGroup legendText="Moneda">
	<RadioButtonGroup id="currency" {orientation} bind:selected={selectedCurrency}>
		{#if currencies}
			{#each currencies as currency}
				<RadioButton labelText={`${currency.name_plural.replace(/(^|\s)\S/g, l => l.toUpperCase())} (${currency.symbol})`} value={currency} />	
			{/each}
		{/if}
	</RadioButtonGroup>
</FormGroup>