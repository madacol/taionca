<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable, Button, TextArea, ButtonSet } from "carbon-components-svelte";
    
    const headers=[
        { key: 'user', value: 'Usuario' }, 
        { key: 'description', value: 'Descripción' },
        { key: 'request', value: 'Solicitud' },
        { key: 'date', value: 'Fecha' }
    ]
    const rows=[
        { id: '1', user: '1', description: 'Petición/Solicitud 1', request: "4545" , date: '30/1/2021' }, 
        { id: '2', user: '2', description: 'Petición/Solicitud 2', request: "4545" , date: '30/5/2021' }, 
        { id: '3', user: '3', description: 'Petición/Solicitud 3', request: "4545" , date: '30/9/2021' }, 
        { id: '4', user: '4', description: 'Petición/Solicitud 4', request: "4545" , date: '30/7/2021' }, 
        { id: '5', user: '5', description: 'Petición/Solicitud 5', request: "4545" , date: '30/2/2021' }, 
        { id: '6', user: '6', description: 'Petición/Solicitud 6', request: "4545" , date: '30/4/2021' }
    ]

    let detail;
    
    let selectedRowIds = [rows[0].id];
    $: console.log("selectedRowIds", selectedRowIds);
</script>
        
<DataTable title="Solicitudes pendientes" description="Seleccione una solicitud, ingrese un comentario y apruebe o niegue la solicitud." sortable radio bind:selectedRowIds {headers} {rows} />

<TextArea placeholder="En caso de ser necesario anexe un breve comentario" bind:value={detail}/>

<ButtonSet>
    <Button kind="danger">Rechazar</Button>
    <Button>Aprobar</Button>
</ButtonSet>