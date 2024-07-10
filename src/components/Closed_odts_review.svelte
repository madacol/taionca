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
	let odt_closure_resume = [];
	let isDisabled = true;
	let admin_profit;
	let taionca_profit;
	let general_expenses;
	let inv_expenses;

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
		({odt_closure_resume} = await apiFetch(`/api/public/odt_closure_resume/${odt.id_odt}`));
		await tick();
		console.log(odt_closure_resume)
		set_data_balance_movements();
		set_data_currency_movements();
		set_data_closure_resume();
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

	let headers_commissions = [
		{ key: "user", value: "Usuario"  },
		{ key: "position", value: "Cargo"  },
		{ key: "percentage", value: "%"  },
		{ key: "profit", value: "Monto"  }
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

	let rows_commissions = [];
	function set_data_closure_resume(){
		admin_profit = Number(odt_closure_resume.admin_profit).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		taionca_profit = Number(odt_closure_resume.taionca_profit).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		general_expenses = Number(odt_closure_resume.general_expenses).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		inv_expenses = Number(odt_closure_resume.inv_expenses).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

		if (odt_closure_resume.ceo_commissions.length > 0 || odt_closure_resume.admin_commissions.length > 0 || odt_closure_resume.operative_commissions.length > 0 || odt_closure_resume.supervisor_commissions.length > 0){

			let id = 0;
			let all_commissions = odt_closure_resume.ceo_commissions;
			odt_closure_resume.admin_commissions.forEach(user => all_commissions.push(user));
			odt_closure_resume.operative_commissions.forEach(user => all_commissions.push(user));
			odt_closure_resume.supervisor_commissions.forEach(user => all_commissions.push(user));

			rows_commissions = all_commissions.map((user) => ({
				user: `${user.user_name} ${user.user_lastname}`,
				position: user.user_position,
				percentage: `${(Number(user.percent)*100).toFixed(2)}%`,
				profit: `${odt.symbol}${Number(user.profit).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
				id: id++
			}))
		}
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

	$:console.log(odt_closure_resume)
	$:console.log(rows_commissions)
	
</script>
<style>
	/* write simple css for some margin*/
	.margin{
		margin: 10px;
	}
</style>

<Closed_odts bind:odt={odt} on:select={get_odt_movements} {is_filtered} {start_date} {end_date}/>

{#if odt && odt_closure_resume} 

	<Grid narrow>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Id de la ODT: {odt.id_odt}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Monto de contrato: {odt.symbol}{Number(odt.amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
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
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Descripción del trabajo:</h5>
			</Column>
			<Column sm={2} style="outline: 1px solid var(--cds-interactive-04)">
				<h5>{odt.description}</h5>
			</Column>
		</Row>		
		<Row>
			<Column style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Dinero para Taionca: {odt.symbol}{taionca_profit}</h5>
			</Column>
		</Row>
		<Row>
			<Column style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Dinero para Administración: {odt.symbol}{admin_profit} | {(admin_percent*100).toFixed(2)}% </h5>
			</Column>
		</Row>
		<Row>
			<Column style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Dinero utilizado para gastos generales: {odt.symbol}{general_expenses}</h5>
			</Column>
		</Row>
		<Row>
			<Column style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Dinero utilizado para gastos de inventario: {odt.symbol}{inv_expenses}</h5>
			</Column>
		</Row>
	</Grid>

	{#if rows_commissions.length!=0}
		<div class="margin">
			<DataTable size="short" title='Comisiones de la ODT {odt.id_odt}' sortable headers={headers_commissions} rows={rows_commissions} />
		</div>
	{/if}

	{#if rows_balance_movements.length!=0 || rows_currencies.length!=0}
		<div class="margin">
			<DataTable size="short" title="Gastos por moneda" sortable headers={headers_currencies} rows={rows_currencies} />
		</div>	
		<div class="margin">
			<DataTable size="short" title="Gastos de la ODT" sortable headers={headers_balance_movements} rows={rows_balance_movements} />
		</div>
	{/if}
{/if}