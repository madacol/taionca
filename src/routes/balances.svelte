<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable} from "carbon-components-svelte";
	import Entitys from "../components/Entitys.svelte";
	import { apiFetch } from '../functions';

	let entity;
	let balances = [];
	let rows = [];
	onMount(async ()=>{
		 ({balances} = await apiFetch('/api/public/balances'));
	})

    //HEADERS
	let headers = [
	{ key: "name", value: "Cuentas"  },
    { key: "balance", value: "Saldo" }
	];

	//ROWS
	$: if (entity){
		let balances_filtered = balances.filter(({id_entity}) => id_entity === entity.value);
		rows = balances_filtered.map(balance => ({
			id: balance.id_balance,
			balance: `${Number(balance.balance).toFixed(2)} ${balance.symbol}`,
			name: `(${balance.symbol}) ${balance.name}`
		}));
	}
</script>

<Entitys bind:entity={entity}/>

{#if rows.length!=0}<DataTable size="short" title="Balance de cuentas" sortable {headers} {rows} />{/if}
