<script>
    import { TextInput, Button } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';
    import Accounts from "../components/Accounts.svelte";
    import Odts from "../components/Odts.svelte";
    import Users_profit from "../components/Users_profit.svelte";
    import { apiFetch } from '../functions';


    let odt;
    let account;
    let amount;
    let admin_users;
    let operative_users;
    let supervisor_users;

    $: if (odt) ({amount} = odt);
    // $: if (admin_users) {
    //     let admin_percent = 0;
    //     let operative_percent = 0;
    //     let supervisor_percent = 0;

    //     for (let i = 0; i < admin_users.length; i++) {
    //         admin_percent += Number(admin_users[i].profit_percent);
    //         operative_percent += Number(operative_users[i].profit_percent);
    //         supervisor_percent += Number(supervisor_users[i].profit_percent);
    //     }
    // }
    async function send_closure_odts() {
        
        if (true){
            const _admin_users = admin_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            const _operative_users = operative_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            const _supervisor_users = supervisor_users.map(user=>({id_user: user.id_user, profit_percent: user.profit_percent}));
            console.log(_admin_users);
            const responde = await apiFetch ('/api/public/closure_odt', {
                method: 'POST',
                body: JSON.stringify({
                    id_account: account.id_account,
                    id_odt: odt.id_odt,
                    amount,
                    // admin_profit_percent: .05,
                    // operative_profit_percent: .05,
                    // supervisor_profit_percent: .05,
                    admin_users: _admin_users,
                    operative_users: _operative_users,
                    supervisor_users: _supervisor_users
                }),
                headers: {'Content-Type': 'application/json'}
            })
        }
    }

</script>

<TextInput type="Number" labelText="Monto pagado" placeholder="Ingrese el monto..." bind:value={amount}/>

<Odts bind:odt={odt}/>

{#if odt}
    <Accounts id_currency_filter={odt.id_currency} bind:account={account}/>
{/if}

<Users_profit label="Admin" bind:users_profit={admin_users} />

<Users_profit label="Operative" bind:users_profit={operative_users} />

<Users_profit label="Supervisor" bind:users_profit={supervisor_users} />

<Button on:click={send_closure_odts}>Cerrar ODT</Button>
