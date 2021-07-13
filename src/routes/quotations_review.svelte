<script>
	import 'carbon-components-svelte/css/white.css';
    import { DataTable, Grid, Row, Column } from "carbon-components-svelte";
	import Quotations from '../components/Quotations.svelte';
	import { apiFetch } from '../functions';
	let quotation;
	let quotation_general_expenses = [];
	let quotation_spendable_inv_expenses = [];
	let quotation_no_spendable_inv_expenses = [];
	let id = 0;
	
	async function get_quotation(){
		({quotation_general_expenses, quotation_spendable_inv_expenses, quotation_no_spendable_inv_expenses} = await apiFetch(`/api/public/quotations_review/${quotation.id_quotation}`));
		
	}
		// $: if (quotation) {
		// } // Esos maricos paréntesis son importantes imbécil!!!
	//HEADERS
	let headers_quotation_expenses = [
		{ key: "kind", value: "Tipo de gasto" },
		{ key: "quantity", value: "Cantidad" },
		{ key: "amount_label", value: "Monto" },
		{ key: "description", value: "Descripción" },
	];

	let headers_currencies = [
		{ key: "currency", value: "Moneda"  },
		{ key: "balance", value: "Monto"  }
	];


	//ROWS
	let rows_quotation_general_expenses=[];
	$: if (quotation_general_expenses){
		rows_quotation_general_expenses = quotation_general_expenses.map(_quotation => ({
			id: id++,
			kind: _quotation.kind,
			quantity: `${Number(_quotation.quantity).toFixed(2)} ${_quotation.measure_unit}`,
			amount: _quotation.amount,
			amount_label: `${Number(_quotation.amount).toFixed(2)} ${_quotation.currency_symbol}`,
			description: _quotation.description,
			currency: _quotation.currency_name_plural
		}));
	}

	let rows_quotation_spendable_inv_expenses=[];
	$: if (quotation_spendable_inv_expenses){
		rows_quotation_spendable_inv_expenses = quotation_spendable_inv_expenses.map(quotation_inv => ({
			id: id++,
			kind: quotation_inv.kind,
			quantity: `${Number(quotation_inv.quantity).toFixed(2)} ${quotation_inv.measure_unit}`,
			amount: quotation_inv.amount,
			amount_label: `${Number(quotation_inv.amount).toFixed(2)} $`,
			currency: "dólares",
			currency_symbol: "$",
			description: quotation_inv.description
		}));
	}

	let rows_quotation_no_spendable_inv_expenses=[];
	$: if (quotation_no_spendable_inv_expenses){
		rows_quotation_no_spendable_inv_expenses = quotation_no_spendable_inv_expenses.map(_quotation => ({
			id: id++,
			kind: _quotation.kind,
			quantity: `${Number(_quotation.quantity).toFixed(2)} ${_quotation.measure_unit}`,
			amount: _quotation.amount,
			amount_label: `${Number(_quotation.amount).toFixed(2)} $`,
			currency: "dólares",
			currency_symbol: "$",
			description: _quotation.description
		}));
	}

	$: rows_quotation_expenses = [...rows_quotation_general_expenses, ...rows_quotation_spendable_inv_expenses, ...rows_quotation_no_spendable_inv_expenses];

	let rows_currencies = [];
	$: if (rows_quotation_expenses.length>0){
		const currencies_auxiliar = {};
		rows_quotation_expenses.forEach(_quotation => {
			if (currencies_auxiliar[_quotation.currency] === undefined) {
				currencies_auxiliar[_quotation.currency] = 0;
			}
			currencies_auxiliar[_quotation.currency] += Number(_quotation.amount)
		});
		rows_currencies = Object.entries(currencies_auxiliar).map(([currency, balance], id) => ({
			currency: currency.replace(/(^|\s)\S/g, l => l.toUpperCase()),
			balance: `${Number(balance).toFixed(2)}`,
			id
		}))
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
</script>

<Quotations on:select={get_quotation} bind:quotation={quotation}/>

{#if quotation} 

	<Grid>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Id de la quotation: {quotation.id_quotation}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Monto de contrato: {Number(quotation.amount).toFixed(2)} {quotation.symbol}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Moneda utilizada: {quotation.name_plural}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Cliente: {quotation.name}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Responsable: {quotation.user_name}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Fecha de apertura: {(new Date(quotation.created_at)).toLocaleString("es-ES",options)}</h5>
			</Column>
		</Row>
		<Row>
			<Column padding style="outline: 1px solid var(--cds-interactive-04)">
				<h5>Descripción del trabajo:</h5>
			</Column>
		</Row>
		<Row>
			<Column sm={2} style="outline: 1px solid var(--cds-interactive-04)">
				<h5>{quotation.description}</h5>
			</Column>
		</Row>
	</Grid>

	{#if rows_quotation_expenses.length!=0 || rows_currencies.length!=0}
		<DataTable size="short" title="Gastos cotizados" sortable headers={headers_quotation_expenses} rows={rows_quotation_expenses} />

		<DataTable size="short" title="Gastos cotizados por moneda" sortable headers={headers_currencies} rows={rows_currencies} />
	{/if}
{/if}