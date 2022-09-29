<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable} from "carbon-components-svelte";
	import Entitys from "../components/Entitys.svelte";
	import { apiFetch } from '../functions';

	let entity;
	let balance_registers = [];
	let rows = [];
	onMount(async ()=>{
		 ({balance_registers} = await apiFetch('/api/public/balance_registers'));
	})

    //HEADERS
	let headers = [
	{ key: "name", value: "Cuentas"  },
    { key: "balance_register", value: "Saldo" }
	];

	//ROWS
	$: if (entity){
		let balance_registers_filtered = balance_registers.filter(({id_entity}) => id_entity === entity.value);
		rows = balance_registers_filtered.map(balance_register => ({
			id: balance_register.id_balance_register,
			balance_register: `${Number(balance_register.balance).toFixed(2)} ${balance_register.symbol}`,
			name: `(${balance_register.symbol}) ${balance_register.name}`
		}));
	}
</script>

<Entitys bind:entity={entity}/>

{#if rows.length!=0}<DataTable size="short" title="Registros de los balances" sortable {headers} {rows} />{/if}
