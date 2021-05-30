
<script>
    import { TextInput, Button, TextArea } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import Currency from './Currency.svelte';

    const NEW_GENERAL_EXPENSE = {
        amount: null,
        currency: null,
        description:""
    };

    export let general_expenses = [ {...NEW_GENERAL_EXPENSE} ];
    export let label;

    function addGeneralExpense() {
        general_expenses = [ ...general_expenses, {...NEW_GENERAL_EXPENSE} ]
    }

    function removeGeneralExpenseBuilder(index_to_remove) {
        return ()=>{
            general_expenses = general_expenses.filter((_u, index) => index !== index_to_remove)
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

<div>
    <h4>{label}</h4>
    {#each general_expenses as general_expense, index}
        <div class="OnSameLine">
        
            <div>
                <Currency bind:currency={general_expense.currency}/>
                
                <TextInput type="Number" placeholder="Monto del gasto..." bind:value={general_expense.amount}/>
                
                <TextArea placeholder="Ingrese la descripción del gasto..." bind:value={general_expense.description}/>
            </div>

            
            <!-- Plantilla -->
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeGeneralExpenseBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addGeneralExpense}>Agregar gasto general</Button>
</div>
