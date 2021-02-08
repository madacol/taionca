<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable } from "carbon-components-svelte";
    
    const headers=[
        { key: 'usd', value: 'Dólares' }, 
        { key: 'ves', value: 'Bolívares' },
        { key: 'cop', value: 'Pesos' },
        { key: 'eur', value: 'Euros' },
        { key: 'btc', value: 'Bitcoins' }
    ]
    const rows=[
        { id: '1', usd: '9156', ves: '41', cop: '94888', eur:"650", btc:"85" }
    ]
</script>
        
<DataTable title="Deudas de *Usuario*" sortable {headers} {rows} />