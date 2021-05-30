<script>
	import SelectSearch from '../components/Select.svelte';

	export let quotation;
	/** @type {"vertical" | "horizontal"}*/
	import { onMount } from 'svelte';
	import { apiFetch } from '../functions';
	
	/**
	 * Get quotations, If needed
	 */
    let quotations = [];
	onMount(async ()=>{
		 ({quotations} = await apiFetch('/api/public/quotations'));
	})
	
	let quotationsToList = [];
	$: if (quotations.length > 0) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		quotationsToList = quotations.map(quotation => {
			const {id_quotation, name, created_at, amount, symbol} = quotation;
            const date=(new Date(created_at)).toLocaleString("es-ES",options);
            const quotation_amount=Number(amount).toFixed(2);
			return ({
				...quotation,
				value: id_quotation, 
				label: `${id_quotation} | ${name} | ${symbol}.${quotation_amount} | ${date}`
			})
		})
	}

</script>

<SelectSearch placeholder="Cotizaciones..." bind:selected={quotation} on:select items={quotationsToList}/>
