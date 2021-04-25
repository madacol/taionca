<script>
    import 'carbon-components-svelte/css/white.css';
	import { onMount } from 'svelte';
    import { DataTable, DatePickerInput } from "carbon-components-svelte";
	import Entitys from "../components/Entitys.svelte";

// Movements

	let movements = [];
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
	
	//ROWS
	$: if (movements.length>0){
		let datevar1=new Date(date1);
		let datevar2=new Date(date2);
		let movements_filtered = movements.filter(({created_at}) => {

			console.log(created_at);
			console.log((new Date(created_at)));

			return datevar1<=(new Date(created_at)) && (new Date(created_at))<=datevar2
		});
		rows_movements = movements_filtered.map(movement => ({
			id_balance: movement.id_balance,
			id: movement.id_balance_movement,
			entity: movement.entity,
			odt: movement.id_odt,
			account: `${movement.account} ${movement.currency}`,
			amount: Number(movement.amount).toFixed(2),
			created_at: (new Date(movement.created_at)).toLocaleDateString()
		}));
	}
	
// Balances_PAST
	
	let entity;
	let balances = [];
	let rows_balances_past = [];
	onMount(async ()=>{
		const response = await fetch('/api/public/balances');
		balances = await response.json();
	})

    //HEADERS
	let headers_balances = [
		{ key: "name", value: "Cuentas"  },
		{ key: "balance", value: "Saldo inicial" },
		{ key: "balance_actual", value: "Saldo final" }
	];
	
	
	//ROWS
	$: if (entity && balances.length>0){
		let balances_filtered = balances.filter(({id_entity}) => id_entity === entity.value);
		rows_balances_past = balances_filtered.map(balance => ({
			amount: balance.balance,
			id: balance.id_balance,
			balance: `${Number(balance.balance).toFixed(2)} ${balance.symbol}`,
			balance_actual: `${Number(balance.balance).toFixed(2)} ${balance.symbol}`,
			name: `(${balance.symbol}) ${balance.name}`
		}));
		for (var i = 0; i < rows_balances_past.length; i++) {
			for (var j = 0; j < rows_movements.length; j++){
				if (rows_balances_past[i].id === rows_movements[j].id_balance){
					let amount_balance = Number(rows_balances_past[i].amount);
					let amount_movement = Number(rows_movements[j].amount);
					rows_balances_past[i].balance = amount_balance - amount_movement;

					console.log(amount_balance);
					console.log(amount_movement);
					console.log(rows_balances_past[i].balance);
					console.log(i);
				}
			}
		}
	// 	rows_balances_past.forEach( balance => {
	// 		if (balance.id === ){

	// 		}
	// 	});
	}


// Balances_ACTUAL

	//ROWS
	let rows_balances_actual = [];
	$: if (entity && balances.length>0){
	let balances_filtered = balances.filter(({id_entity}) => id_entity === entity.value);
	rows_balances_actual = balances_filtered.map(balance => ({
		amount: balance.balance,
		id: balance.id_balance,
		balance: `${Number(balance.balance).toFixed(2)} ${balance.symbol}`,
		name: `(${balance.symbol}) ${balance.name}`
	}));
}
//Currencies
    //HEADERS
	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "balance_inicial", value: "Saldo inicial"  },
		{ key: "balance_final", value: "Saldo final"  }
	];

	let rows_currencies=[
		{id: "1" , currency: "Dólares" , balance_inicial:"0.00" , balance_final:"0.00"	},
		{id: "2" , currency: "Bolívares" , balance_inicial:"0.00" , balance_final:"0.00" 	},
		{id: "3" , currency: "Pesos" , balance_inicial:"0.00" , balance_final:"0.00" 	},
		{id: "4" , currency: "Euros" , balance_inicial:"0.00" , balance_final:"0.00" 	},
		{id: "5" , currency: "Bitcoins" , balance_inicial:"0.00" , balance_final:"0.00" 	}
	];

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
		<DatePickerInput labelText="Fecha inicial" placeholder="mm/dd/aaaa" />
	</svelte:component>
	<svelte:component this={DatePicker} bind:value={date2} datePickerType="single" locale={navigator.language}>
		<DatePickerInput labelText="Fecha final" placeholder="mm/dd/aaaa" />
	</svelte:component>
{/if}	
</div>

<DataTable size="short" title="Movimientos" sortable headers={headers_movements} rows={rows_movements} />

<Entitys bind:entity={entity}/>

<div class="OnSameLine">
	{#if rows_balances_past.length!=0}<DataTable size="short" title="Balance" sortable headers={headers_balances} rows={rows_balances_past} />{/if}
</div>

<DataTable size="short" title="Balance de monedas" sortable headers={headers_currencies} rows={rows_currencies} />