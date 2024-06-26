<script>
	import 'carbon-components-svelte/css/white.css';
    import { DataTable, Grid, Row, Column, Button } from "carbon-components-svelte";
	import Closed_odts from './Closed_odts.svelte';
	import { apiFetch, checkPermissions } from '../functions';
    import { onMount, tick } from 'svelte';
	import { session } from '../stores';
	import { PRESIDENT } from '../constants/PERMISSIONS';

	export let start_date;
	export let end_date;
	export let is_filtered;

	let admin_percent;
	let odt;
	let balance_movements = [];
	let isDisabled = true;

	onMount(async ()=>{
		const result = await apiFetch("/api/user");
		$session = result.session;
		await tick();
		check_permissions();
	})

	function check_permissions(){
		let user_permissions = ($session && $session.permissions) || [];
		if (checkPermissions([PRESIDENT[1]], user_permissions)){
			isDisabled = false;
		}
	}
	
	async function get_odt_movements(){
		admin_percent = Number(odt.admin_percent);
		({balance_movements} = await apiFetch(`/api/public/odt_movements/${odt.id_odt}`));
		await tick();
		set_data_balance_movements();
		set_data_currency_movements();
	}
	//HEADERS
		let headers_balance_movements = [
			{ key: "entity", value: "Entidad"  },
			{ key: "account", value: "Cuenta" },
			{ key: "amount_label", value: "Monto" },
			{ key: "created_at", value: "Fecha" },
	];

	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "balance", value: "Saldo gastado"  }
	];


	//ROWS
	let rows_balance_movements=[];
	function set_data_balance_movements(){
		rows_balance_movements = balance_movements.map(movement => ({
			id_balance: movement.id_balance,
			entity: movement.entity,
			account: movement.account,
			end_balance: Number(movement.end_balance).toFixed(2),
			created_at: (new Date(movement.created_at)).toLocaleDateString(),
			id: movement.id_balance_movement,
			amount: movement.amount,
			amount_label: `${Number(movement.amount).toFixed(2)} ${movement.symbol}`,
			currency: movement.currency.replace(/(^|\s)\S/g, l => l.toUpperCase())
		}));
	}
	let rows_currencies = [];
	function set_data_currency_movements(){
		if (rows_balance_movements.length>0){
			const currencies_auxiliar = {};
			rows_balance_movements.forEach(movement => {
				if (currencies_auxiliar[movement.currency] === undefined) {
					currencies_auxiliar[movement.currency] = 0;
				}
				currencies_auxiliar[movement.currency] += Number(movement.amount)
			});
			rows_currencies = Object.entries(currencies_auxiliar).map(([currency, balance], id) => ({
				currency,
				balance: Number(balance).toFixed(2),
				id
			}))
		}
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
</script>

<Closed_odts bind:odt={odt} on:select={get_odt_movements} {is_filtered} {start_date} {end_date}/>

{#if odt} 

	<Grid narrow>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Id de la ODT: {odt.id_odt}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Monto de contrato: {Number(odt.amount).toFixed(2)} {odt.symbol}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Cliente: {odt.name}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Responsable: {odt.user_name}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Fecha de apertura: {(new Date(odt.created_at)).toLocaleString("es-ES",options)}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Fecha de cierre: {(new Date(odt.closed_at)).toLocaleString("es-ES",options)}</h5>
			</Column>
		</Row>
		<Row>
			<Column style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Porcentaje administrativo: {admin_percent*100}%</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Descripción del trabajo:</h5>
			</Column>
			<Column sm={2} style="outline: 1px solid var(--cds-interactive-04)">
				<h5>{odt.description}</h5>
			</Column>
		</Row>		
	</Grid>

		{#if rows_balance_movements.length!=0 || rows_currencies.length!=0}
		<DataTable size="short" title="Gastos por moneda" sortable headers={headers_currencies} rows={rows_currencies} />
		
		<DataTable size="short" title="Gastos de la ODT" sortable headers={headers_balance_movements} rows={rows_balance_movements} />
	{/if}
{/if}