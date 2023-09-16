<script>
	import 'carbon-components-svelte/css/white.css';
	import {DataTable} from "carbon-components-svelte";
	import { apiFetch } from '../functions';
    import Users from '../components/Users.svelte';
	
	let user;
	let rows;
	let rows_register;
	let loans;
	let loans_register;

	async function get_loans(){
		({loans_register} = await apiFetch('/api/public/loans_registers'));
		({loans} = await apiFetch('/api/public/loans'));
		let loans_filtered = loans.filter(({id_user}) => id_user === user.value);
		rows = loans_filtered.map(loan => ({
			id: loan.id_loan,
			currency: loan.name_plural.replace(/(^|\s)\S/g, l => l.toUpperCase()),
			amount: `${Number(loan.amount).toFixed(2)} ${loan.symbol}`
		}));

		console.log(loans_register)
		let loans_register_filtered = loans_register.filter(({id_user}) => id_user === user.value); 
		rows_register = loans_register_filtered.map(loan_register => ({
			id: loan_register.id_loans_register,
			currency: loan_register.name_plural.replace(/(^|\s)\S/g, l => l.toUpperCase()),
			amount: `${Number(loan_register.amount).toFixed(2)} ${loan_register.symbol}`,
			description: loan_register.description,
			date: new Date(loan_register.created_at).toLocaleDateString()
		}));
	}

    //HEADERS
	let headers = [
	{ key: "currency", value: "Moneda"  },
    { key: "amount", value: "Saldo adeudado" }
	];

	let headers_register = [
	{ key: "date", value: "Fecha" },
	{ key: "currency", value: "Moneda"  },
    { key: "amount", value: "Saldo" },
    { key: "description", value: "Comentario" },
	];

</script>

	<Users bind:user={user} on:select={get_loans}/>

	{#if rows}<DataTable size="short" title="Deudas" sortable {headers} {rows} />{/if}

	{#if rows_register}<DataTable size="short" title="Registro de préstamos" sortable headers = {headers_register} rows = {rows_register} />{/if}
