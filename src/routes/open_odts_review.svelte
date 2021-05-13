<script>
	import 'carbon-components-svelte/css/white.css';
    import { DataTable, Grid, Row, Column } from "carbon-components-svelte";
	import Odts from '../components/Odts.svelte';
	import { onMount } from 'svelte';

	onMount(async ()=>{
		const response = await fetch('/api/public/balance_movements');
		movements = await response.json();
	})
	
	let odt;
	let movements = [];
	let movements_filtered = [];

	//HEADERS
		let headers_movements = [
			{ key: "entity", value: "Entidad"  },
			{ key: "id_balance_movement", value: "Id del movimiento"  },
			{ key: "account", value: "Cuenta" },
			{ key: "amount", value: "Monto" },
			{ key: "created_at", value: "Fecha" },
	];

	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "expense_balance", value: "Saldo gastado"  }
	];


	//ROWS
	let rows_movements=[];
	$: if (movements.length>0 && odt){
		movements_filtered = movements.filter(({id_odt}) => {
			return id_odt === odt.id_odt
		});
		rows_movements = movements_filtered.map(movement => ({
			id_balance: movement.id_balance,
			id: movement.id_balance_movement,
			entity: movement.entity,
			id_balance_movement: movement.id_balance_movement,
			account: `${movement.account} ${movement.currency}`,
			amount: Number(movement.amount).toFixed(2),
			end_balance: Number(movement.end_balance).toFixed(2),
			created_at: (new Date(movement.created_at)).toLocaleDateString()
		}));
	}

	let rows_currencies = [];
	

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	$: console.log(odt);
	
</script>

<Odts bind:odt={odt}/>

{#if odt} 

	<Grid>
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
				<h5>Moneda utilizada: {odt.name_plural}</h5>
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
				<h5>Descripción del trabajo:</h5>
			</Column>
		</Row>
		<Row>
			<Column sm={2} style="outline: 1px solid var(--cds-interactive-04)">
				<h5>{odt.description}</h5>
			</Column>
		</Row>
	</Grid>

	{#if rows_movements.length!=0 || rows_currencies.length!=0}
		<DataTable size="short" title="Movimientos" sortable headers={headers_movements} rows={rows_movements} />

		<DataTable size="short" title="Balance de monedas" sortable headers={headers_currencies} rows={rows_currencies} />
	{/if}
{/if}