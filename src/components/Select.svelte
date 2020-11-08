<script>
	import SvelteSelect from 'svelte-select';
	/** @type {any} */
	export let items
	let selectedValue = undefined;
</script>

<SvelteSelect {...$$restProps} {items} bind:selectedValue></SvelteSelect>