<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable } from "carbon-components-svelte";
    
    const headers=[
        { key: 'day', value: 'Día' }, 
        { key: 'attendance', value: 'Asistencia' },
        { key: 'date', value: 'Fecha' }
    ]
    const rows=[
        { id: '1', day: 'Lunes', attendance: '✔', date: '30/1/2021' }, 
        { id: '2', day: 'Martes', attendance: '✘', date: '30/5/2021' }, 
        { id: '3', day: 'Miércoles', attendance: '✔', date: '30/9/2021' }, 
        { id: '4', day: 'Jueves', attendance: '✘', date: '30/7/2021' }, 
        { id: '5', day: 'Viernes', attendance: '✔', date: '30/2/2021' }, 
        { id: '6', day: 'Sábado', attendance: '✘', date: '30/4/2021' }
    ]
</script>
        
<DataTable title="Asistencia de *Usuario*" sortable {headers} {rows} />