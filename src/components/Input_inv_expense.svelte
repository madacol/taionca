<script>
    import { TextInput, Button, TextArea } from 'carbon-components-svelte';
	import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
    import AllInvItems from './All_inv_items.svelte';

    export let inv_expense;

    $: if(inv_expense.item){
        inv_expense.amount = inv_expense.item.price;
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

    .placeholder{
        opacity: 60%;
        margin-left: 1em;
    }
</style>

<div class="OnSameLine">
    <div>
        <AllInvItems bind:item={inv_expense.item}/>
        
        <TextInput type="Number" placeholder="Precio unitario..." bind:value={inv_expense.amount}/>
        
        <TextInput type="Number" placeholder="Cantidad gastada..." bind:value={inv_expense.quantity}/>
    </div>

    <div>
        <h6 class="placeholder">El precio unitario debe ir en dólares $</h6>

        <TextArea placeholder="Ingrese la descripción del gasto..." bind:value={inv_expense.description}/>
    </div>
    
    
    <!-- Plantilla -->

    <Button kind="danger" hasIconOnly iconDescription="Borrar" icon={TrashCan16} on:click/>
</div>

