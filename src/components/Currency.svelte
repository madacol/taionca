<script>
	import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  }
	from "carbon-components-svelte";

	export let currency;
	/** @type {"vertical" | "horizontal"}*/
	export let orientation = "horizontal";

</script>

<FormGroup legendText="Moneda">
	<RadioButtonGroup {orientation} bind:selected={currency}>
		<RadioButton labelText="Dólares $" value="dolar" />
		<RadioButton labelText="Bolívares Bs" value="bolivar" />
		<RadioButton labelText="Pesos COP" value="peso" />
		<RadioButton labelText="Euros €" value="euro" />
		<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
	</RadioButtonGroup>
</FormGroup>