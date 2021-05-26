<script>
	import SelectSearch from '../components/Select.svelte';

	export let supplier;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get suppliers, If needed
	 */

    let suppliers = [];
    let suppliersToList = [];
	onMount(async ()=>{
		 ({suppliers} = await apiFetch('/api/public/suppliers'));
	})

	$: if (suppliers.length > 0) {
		suppliersToList = suppliers.map(({ id_supplier, name }) => {
			return ({value: id_supplier, label: name})
		})
	}

</script>

<SelectSearch placeholder="Proveedores..." bind:selected={supplier} items={suppliersToList}/>