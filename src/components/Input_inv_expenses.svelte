
<script>
    import { TextInput, Button, TextArea } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import AllInvItems from './All_inv_items.svelte';

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

    function removeInvExpenseBuilder(index_to_remove) {
        return ()=>{
            inv_expenses = inv_expenses.filter((_u, index) => index !== index_to_remove)
        }
    }

    $: inv_expenses = inv_expenses.map(inv_expense => {
        return {
            ...inv_expense
        }
    })

</script>

<style>
    div {
        margin-bottom: 1em;
    }
    .OnSameLine{
        display: flex;
        justify-content: flex-start;
    }

    .placeholder{
        opacity: 60%;
        margin-left: 1em;
    }
</style>

<div>
    <h4>{label}</h4>
    {#each inv_expenses as inv_expense, index}
        <div class="OnSameLine">
            <div>
                <TextInput type="Number" placeholder="Cantidad gastada..." bind:value={inv_expense.quantity}/>

                <TextInput type="Number" placeholder="Precio unitario..." bind:value={inv_expense.amount}/>
                
                <AllInvItems bind:item={inv_expense.item}/>
            </div>

            <div>
                <h6 class="placeholder">El precio unitario debe ir en dólares $</h6>
    
                <TextArea placeholder="Ingrese la descripción del gasto..." bind:value={inv_expense.description}/>
            </div>
            
            
            <!-- Plantilla -->
        
            <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click={removeInvExpenseBuilder(index)}/>
        </div>
    {/each}
    
    <Button on:click={addInvExpense}>Agregar gasto de inventario</Button>
</div>
