
<script>
    import Input_inv_expense from './Input_inv_expense.svelte';
    import { Button } from 'carbon-components-svelte';

    const NEW_INV_EXPENSE = {
        quantity: null,
        amount: null,
        item: null,
        description:""
    };

    export let inv_expenses = [ {...NEW_INV_EXPENSE} ];
    export let label;

    function addInvExpense() {
        inv_expenses = [ ...inv_expenses, {...NEW_INV_EXPENSE} ]
    }

    $: inv_expenses = inv_expenses.map(inv_expense => {
        return {
            ...inv_expense
        }
    })

    function removeInvExpenseBuilder(index_to_remove) {
        return ()=>{
            inv_expenses = inv_expenses.filter((_u, index) => index !== index_to_remove)
        }
    }

</script>

<style>
    div {
        margin-bottom: 1em;
    }
</style>

<div>
    <h4>{label}</h4>
    {#each inv_expenses as inv_expense, index}
        <Input_inv_expense
            {inv_expense}
            on:click={removeInvExpenseBuilder(index)}
        />
    {/each}
    
    <Button on:click={addInvExpense}>Agregar gasto de inventario</Button>
</div>
