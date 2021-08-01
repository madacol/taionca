
<script>
    import { Button } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import PayrollOdtHours from './Payroll_odt_hours.svelte';
    import Accounts from './Accounts.svelte';

    const NEW_PAYROLL = {
        hours_by_odt: [],
        account: null
    };

    export let payroll_accounts = [ {...NEW_PAYROLL} ];
    export let label;

    function addPayrollAccount() {
        payroll_accounts = [ ...payroll_accounts, {...NEW_PAYROLL} ]
    }

    function removePayrollAccountBuilder(index_to_remove) {
        return ()=>{
            payroll_accounts = payroll_accounts.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: payroll_accounts = payroll_accounts.map(payroll_account => {
        return {
            ...payroll_account
        }
    })

</script>

<div>
    <h4>{label}</h4>
    {#each payroll_accounts as payroll_account, index}
        <PayrollOdtHours bind:hours_by_odt={payroll_account.hours_by_odt} />
        <Accounts bind:account={payroll_account.account}/>
        <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removePayrollAccountBuilder(index)}/>
    {/each}
    <Button on:click={addPayrollAccount}>Agregar usuario</Button>
</div>
