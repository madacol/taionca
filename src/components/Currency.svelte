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
	export let currencies;

</script>


<FormGroup legendText="Moneda">
	<RadioButtonGroup {orientation} bind:selected={selectedCurrency}>
		{#each currencies as currency}
			<RadioButton labelText={currency.name} value={currency.id_currency} />	
		{/each}
	</RadioButtonGroup>
</FormGroup>