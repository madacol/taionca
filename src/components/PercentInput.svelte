<script>
    import { TextInput } from 'carbon-components-svelte';

	export let ratio

	let percent = `${Number(ratio) * 100}%`

	$: {
		const percent_stripped = percent.replace(/[^\d\.,]*/g,'')
		percent = percent_stripped+'%'
		const percent_number = Number(percent_stripped)
		if (!percent_number) percent = '0%'
		ratio = Number(percent_number / 100)
	}

</script>

<TextInput type="text" inline size="xl" placeholder="Porcentaje de comisión" bind:value={percent}/>
