<script>
    import { TextInput, Button, Row, Column } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
    import Accounts from "../components/Accounts.svelte";
    import Odts from "../components/Odts.svelte";
    import Users_profit from "../components/Users_profit.svelte";
    import { apiFetch } from '../functions';
    import PercentInput from '../components/PercentInput.svelte';

    let odt;
    let account;
    let amount;
    let admin_users;
    let operative_users;
    let supervisor_users;
    let ceo_percent = 0.1;
    let admin_percent = 0;

    function clean(){
        odt = null;
        account = null;
        amount = null;
        admin_users = [];
        operative_users = [];
        supervisor_users = [];
    }

    function set_amount_odt(){
        if (odt) {
            ({amount} = odt);
            admin_percent = odt.admin_percent;
        }
    }

    async function update_admin_percent(){
		await apiFetch("/api/public/update_admin_percent",{
			method: 'POST',
			body: JSON.stringify({
				admin_percent,
				id_odt: odt.id_odt}),
			headers: {'Content-Type': 'application/json'}
		});
	}

    async function send_closure_odts() {
        if (true){
            const _admin_users = admin_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            const _operative_users = operative_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            const _supervisor_users = supervisor_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            if(odt.admin_percent !== admin_percent){
                await update_admin_percent();
            }
            await apiFetch ('/api/public/closure_odt', {
                method: 'POST',
                body: JSON.stringify({
                    id_account: account.value,
                    id_odt: odt.id_odt,
                    amount,
                    admin_users: _admin_users,
                    operative_users: _operative_users,
                    supervisor_users: _supervisor_users,
                    ceo_percent,
                    admin_percent
                }),
                headers: {'Content-Type': 'application/json'}
            })
            clean();
        }
    }
</script>
<style>
    div {
        margin-bottom: 1em;
    }
    .OnSameLine{
        display: flex;
        justify-content: flex-start;
    }
</style>

<TextInput type="Number" labelText="Monto pagado" placeholder="Ingrese el monto..." bind:value={amount}/>

<Odts bind:odt={odt} on:select={set_amount_odt}/>

{#if odt}
    <Accounts id_currency_filter={odt.id_currency} bind:account={account}/>
{/if}

<Row>
    <Column style="outline: 1px solid var(--cds-interactive-04)">
        <h4>Porcentaje administrativo:</h4>
    </Column>
    <Column style="outline: 1px solid var(--cds-interactive-04)">
        <PercentInput bind:value={admin_percent}/>
    </Column>
</Row>

<Users_profit label="Usuarios administrativos" bind:users_profit={admin_users} />

<Users_profit label="Usuarios operativos" bind:users_profit={operative_users} />

<Users_profit label="Usuarios supervisores" bind:users_profit={supervisor_users} />

<div class="OnSameLine">
    <h4>Presidente</h4>
    <PercentInput bind:value={ceo_percent}/>
</div>

<Button on:click={send_closure_odts}>Cerrar ODT</Button>