<script>
	import SelectSearch from '../components/Select.svelte';

	export let odt;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get odts, If needed
	 */
    let odts = [];
	onMount(async ()=>{
		 ({odts} = await apiFetch('/api/public/odts'));
	})
	
	let odtsToList = [];
	$: if (odts.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		odtsToList = odts.map(odt => {
			const {id_odt, name, created_at, amount, symbol} = odt;
            const date=(new Date(created_at)).toLocaleString("es-ES",options);
            const odt_amount=Number(amount).toFixed(2);
			return ({
				...odt,
				value: id_odt, 
				label: `${id_odt} | ${name} | ${symbol}.${odt_amount} | ${date}`
			})
		})
	}

</script>

<SelectSearch placeholder="Odts..." bind:selected={odt} items={odtsToList} on:select/>
