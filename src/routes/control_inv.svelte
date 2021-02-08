<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable} from "carbon-components-svelte";
    
    const headers=[
        { key: 'code', value: 'Código' }, 
        { key: 'description', value: 'Descripción' },
        { key: 'amount', value: 'Cantidad disponible' },
        { key: 'price_cost', value: 'Precio Compra' },
        { key: 'price_sell', value: 'Precio Venta' },
        { key: 'status', value: 'Estado' }
    ]
    const rows=[
        { id: '1', code: 'E7018-1/8', description: 'Eléctrodos', amount: '6516', price_sell: '$.424' , price_cost: '$.855', status: '⚠️' }, 
        { id: '2', code: 'Gass', description: 'Oxigeno', amount: '521', price_sell: '$.424' , price_cost: '$.75', status: '✅' }, 
        { id: '3', code: 'DC506', description: 'Discos', amount: '7615', price_sell: '$.424' , price_cost: '$.89', status: '❗' }
    ]

</script>
        
<DataTable size="short" title="Control de Inventario" sortable {headers} {rows} />


