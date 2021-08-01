<script>
    import 'carbon-components-svelte/css/white.css';
	import { apiFetch } from '../functions';
	import PayrollAccount from '../components/Payroll_account.svelte';
	import { Button, Tile } from 'carbon-components-svelte';

	let payroll_accounts;
	let payroll_total_amount;
	
	function make_hours_by_odt(){
		let payrolls = [];
		
		payroll_accounts.forEach(({hours_by_odt, account}) => {
			hours_by_odt.forEach(hour_by_odt => {
				payrolls.push({
					id_payroll_odt_hour: hour_by_odt.id_payroll_odt_hour,
					id_account: account.id_account,
					payroll_code: account.code,
					odt_code: hour_by_odt.code
				})
			});
		});
		return payrolls;
	}

	async function send_payroll(){

		let payrolls = make_hours_by_odt();
		
		await apiFetch("/api/public/new_payroll_expense",{
			method: 'POST',
			body: JSON.stringify({payrolls}),
			headers: {'Content-Type': 'application/json'}
		})

		cleanWindows();
	}

	function cleanWindows(){
	}

	async function get_preview(){
		console.log("hola");
		let payrolls = make_hours_by_odt();

		let response = await apiFetch(`/api/public/payroll_preview`,{
            method: 'POST',
            body: JSON.stringify({
                payrolls
            }),headers: {'Content-Type': 'application/json'}
        });
		return response;
	}

	$:if( payroll_accounts && payroll_accounts.lenght > 0 ){
		payroll_total_amount = get_preview();
	}

</script>

<PayrollAccount label="Nómina" bind:payroll_accounts={payroll_accounts}/>
<Tile on:click={get_preview}>Costo total de la nómina: {payroll_total_amount}</Tile>
<Button on:click={send_payroll}>Enviar</Button>
