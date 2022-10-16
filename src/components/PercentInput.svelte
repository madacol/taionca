<script>
    import { TextInput } from 'carbon-components-svelte';

	export let value

	$: percent = `${(Number(value) * 100).toFixed(2)}%`

	function set_style(event){
		const percent_stripped = event.target.value.replace(/[^\d\.,]*/g,'')
		const percent_number = Number(percent_stripped)
		if (!percent_number) value = 0
		else value = Number(percent_number / 100)
	}

</script>

<TextInput on:input={set_style} type="text" inline size="xl" placeholder="Porcentaje de comisión" value={percent}/>