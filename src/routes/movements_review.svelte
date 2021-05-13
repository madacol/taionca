<script>
	import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable, DatePickerInput } from "carbon-components-svelte";
	import Entitys from "../components/Entitys.svelte";
	
	// Movements
	
	let movements = [];
	let movements_filtered = [];
	let rows_movements = [];
    let DatePicker;
	let date1;
	let date2;

	onMount(async ()=>{
		const response = await fetch('/api/public/balance_movements');
		movements = await response.json();
        if (!DatePicker) DatePicker = (await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte')).default;
	})

    //HEADERS
	let headers_movements = [
	{ key: "entity", value: "Entidad"  },
	{ key: "odt", value: "ODT"  },
    { key: "account", value: "Cuenta" },
    { key: "amount", value: "Monto" },
    { key: "created_at", value: "Fecha" },
	];
	
	const _1D_in_ms = 1000*60*60*24;
	//ROWS
	$: if (movements.length>0){
		let date_inicial=new Date(date1);
		let date_final=new Date( Date.parse(date2) + _1D_in_ms);
		console.log(date1, date2, date_inicial, date_final)
		movements_filtered = movements.filter(({created_at}) => {
			return date_inicial<=(new Date(created_at)) && (new Date(created_at))<=date_final
		});
		rows_movements = movements_filtered.map(movement => ({
			id_balance: movement.id_balance,
			id: movement.id_balance_movement,
			entity: movement.entity,
			odt: movement.id_odt,
			account: `${movement.account} ${movement.currency}`,
			amount: Number(movement.amount).toFixed(2),
			end_balance: Number(movement.end_balance).toFixed(2),
			created_at: (new Date(movement.created_at)).toLocaleDateString()
		}));
	}
	
// Balances_PAST
	
	let entity;
	let balances = [];
	let rows_balances = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/balances');
		balances = await response.json();
	})

    //HEADERS
	let headers_balances = [
		{ key: "name", value: "Cuentas"  },
		{ key: "balance_inicial", value: "Saldo inicial" },
		{ key: "balance_final", value: "Saldo final" }
	];
	
	
	//ROWS
	let balances_filtered = [];
	$: if (entity && balances.length>0) balances_filtered = balances.filter(({id_entity}) => id_entity === entity.value);
	$: if (entity && balances.length>0 && movements_filtered.length>0){
		rows_balances = balances_filtered.map(balance => {
			const movements_filtered_by_entity_and_account = movements_filtered.filter( movement => (balance.id_balance === movement.id_balance) )

			let balance_inicial = Number(balance.balance);
			let balance_final = Number(balance.balance);
			if (movements_filtered_by_entity_and_account.length > 0) {
				balance_inicial = Number(movements_filtered_by_entity_and_account[0].end_balance) - Number(movements_filtered_by_entity_and_account[0].amount);
				balance_final = Number(movements_filtered_by_entity_and_account[movements_filtered_by_entity_and_account.length-1].end_balance);
			}

			// Validate balance
			let validate_balance_final = balance_inicial;
			movements_filtered_by_entity_and_account.forEach( movement => {
					validate_balance_final += Number(movement.amount);
			});
			const error_margin=balance_final/validate_balance_final;
			if (0.9999999999<=error_margin && error_margin<=1.0000000001) {
				console.error({validate_balance_final, balance_final});
				alert(`ERROR: Balance final no concuerda. Esto no debe pasar, avisar inmediatamente a maurito. ${validate_balance_final} - ${balance_final}`);
				return;
			}
			return {
				amount: balance.balance,
				id: balance.id_balance,
				balance_inicial: `${Number(balance_inicial).toFixed(2)} ${balance.symbol}`,
				balance_inicial_num: balance_inicial,
				balance_final: `${Number(balance_final).toFixed(2)} ${balance.symbol}`,
				balance_final_num: balance_final,
				name: `(${balance.symbol}) ${balance.name}`,
				currency: balance.name_plural.replace(/(^|\s)\S/g, l => l.toUpperCase()),
				symbol: balance.symbol
			}
		});
	}

	
    //HEADERS
	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "balance_inicial", value: "Saldo inicial"  },
		{ key: "balance_final", value: "Saldo final"  }
	];

	let rows_currencies = [];
	$: if (entity && rows_balances.length>0){
		const currencies_auxiliar = {};
		console.log({rows_balances});
		rows_balances.forEach(balance => {
			if (currencies_auxiliar[balance.currency] === undefined) {
				return currencies_auxiliar[balance.currency] = {...balance};
			}
			currencies_auxiliar[balance.currency].balance_final_num += balance.balance_final_num;
			currencies_auxiliar[balance.currency].balance_final = `${Number(currencies_auxiliar[balance.currency].balance_final_num).toFixed(2)} ${balance.symbol}`;
			currencies_auxiliar[balance.currency].balance_inicial_num += balance.balance_inicial_num;
			currencies_auxiliar[balance.currency].balance_inicial = `${Number(currencies_auxiliar[balance.currency].balance_inicial_num).toFixed(2)} ${balance.symbol}`;
		});
		rows_currencies = Object.entries(currencies_auxiliar).map(([key, balance]) => balance)
	}
</script>

<style>
	.OnSameLine{
		display: flex;
		justify-content: space-around;
	}

	.OnSameLine > :global(*){
		width: 100%;
	}
</style>

<div class="OnSameLine">
{#if DatePicker}
	<svelte:component this={DatePicker} bind:value={date1} datePickerType="single" locale={navigator.language}>
		<DatePickerInput placeholder="Fecha inicial" />
	</svelte:component>
	<svelte:component this={DatePicker} bind:value={date2} datePickerType="single" locale={navigator.language}>
		<DatePickerInput placeholder="Fecha final" />
	</svelte:component>
{/if}	
</div>

<DataTable size="short" title="Movimientos" sortable headers={headers_movements} rows={rows_movements} />

<Entitys bind:entity={entity}/>

<div class="OnSameLine">
	{#if rows_balances.length!=0}<DataTable size="short" title="Balance" sortable headers={headers_balances} rows={rows_balances} />{/if}
</div>

<DataTable size="short" title="Balance de monedas" sortable headers={headers_currencies} rows={rows_currencies} />