<script>
	import SvelteSelect from 'svelte-select';
	export let items
	let selectedValue = undefined;
</script>

<SvelteSelect {items} bind:selectedValue></SvelteSelect>