<script>
	import 'carbon-components-svelte/css/white.css';
    import { DataTable, Grid, Row, Column } from "carbon-components-svelte";
	import Odts from '../components/Odts.svelte';
	import { apiFetch } from '../functions';

	$: if (odt) {
		(async () => {
			({movements} = await apiFetch)(`/api/public/odt_movements/${odt.id_odt}`);
		})();
	}
	
	let odt;
	let movements = [];

	//HEADERS
		let headers_movements = [
			{ key: "entity", value: "Entidad"  },
			{ key: "id_balance_movement", value: "Id del movimiento"  },
			{ key: "account", value: "Cuenta" },
			{ key: "amount_label", value: "Monto" },
			{ key: "created_at", value: "Fecha" },
	];

	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "balance", value: "Saldo gastado"  }
	];


	//ROWS
	let rows_movements=[];
	$: if (movements.length>0 && odt){
		rows_movements = movements.map(movement => ({
			id_balance: movement.id_balance,
			entity: movement.entity,
			id_balance_movement: movement.id_balance_movement,
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
	$: if (rows_movements.length>0){
		const currencies_auxiliar = {};
		rows_movements.forEach(movement => {
			if (currencies_auxiliar[movement.currency] === undefined) {
				currencies_auxiliar[movement.currency] = 0;
			}
			currencies_auxiliar[movement.currency] += Number(movement.amount)
		});
		console.log(currencies_auxiliar);
		rows_currencies = Object.entries(currencies_auxiliar).map(([currency, balance], id) => ({
			currency,
			balance: Number(balance).toFixed(2),
			id
		}))
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
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
		<DataTable size="short" title="Gastos de la ODT" sortable headers={headers_movements} rows={rows_movements} />

		<DataTable size="short" title="Gastos por moneda" sortable headers={headers_currencies} rows={rows_currencies} />
	{/if}
{/if}