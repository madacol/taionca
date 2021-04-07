<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable, Button, FileUploaderDropContainer, TextArea } from "carbon-components-svelte";
    
    const headers=[
        { key: 'number', value: 'N°' }, 
        { key: 'description', value: 'Descripción' },
        { key: 'date', value: 'Fecha de entrega' }
    ]
    const rows=[
        { id: '1', number: '1', description: 'Responsabilidad 1', date: '30/1/2021' }, 
        { id: '2', number: '2', description: 'Responsabilidad 2', date: '30/5/2021' }, 
        { id: '3', number: '3', description: 'Responsabilidad 3', date: '30/9/2021' }, 
        { id: '4', number: '4', description: 'Responsabilidad 4', date: '30/7/2021' }, 
        { id: '5', number: '5', description: 'Responsabilidad 5', date: '30/2/2021' }, 
        { id: '6', number: '6', description: 'Responsabilidad 6', date: '30/4/2021' }
    ]

    let detail;
    
    let selectedRowIds = [rows[0].id];
    $: console.log("selectedRowIds", selectedRowIds);
</script>
        
<DataTable title="Responsabilidades de *Usuario*" description="Seleccione una responsabilidad e inserte la evidencia correspondiente para iniciar su proceso de aprovación." sortable radio bind:selectedRowIds {headers} {rows} />

<TextArea placeholder="En caso de ser necesario anexe un breve comentario" bind:value={detail}/>

<FileUploaderDropContainer labelText="Arrastra y suelta el archivo o haz click aquí para subirlo" multiple/>

<Button>Enviar</Button>

