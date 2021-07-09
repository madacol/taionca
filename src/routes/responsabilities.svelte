<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable, Button, TextArea } from "carbon-components-svelte";
	import { onMount } from 'svelte';
	import { apiFetch, next_date } from '../functions';

	let active_responsibilitys = [];
	onMount(async ()=>{
		({active_responsibilitys} = await apiFetch('/api/public/active_responsibilitys'));
	})
    
    const headers=[
        { key: 'name', value: 'Nombre' },
        { key: 'description', value: 'Descripción' },
        { key: 'importance', value: 'Importancia' },
        { key: 'frequency', value: 'Frecuencia' },
        { key: 'overdue', value: 'Días restantes' },
        { key: 'date', value: 'Fecha de entrega' }
    ]

	function frequency_label(term_label, days_to_repeat){
		if(days_to_repeat){
			term_label = `Cada ${days_to_repeat} días`;
			return term_label;
		} else{
			return term_label;
		}
	}

	let rows=[];
	$: if (active_responsibilitys.length > 0){
		console.log(active_responsibilitys);
		rows = active_responsibilitys.map(responsibility => ({
			
			id: responsibility.id_active_responsibility,
			name: responsibility.name,
			description: responsibility.description,
			importance: responsibility.importance,
			frequency: frequency_label(responsibility.term_label, responsibility.days_to_repeat),
			overdue: (+new Date(next_date(responsibility.deadline, responsibility.term)) - +new Date(new Date ().toLocaleDateString())) / 86400000, //Unix time between the deadline and actual date expressed in days
			date: next_date(responsibility.deadline, responsibility.term).toLocaleDateString()
		}));
	}

    let description;
	let selectedRowIds;
	$: if(selectedRowIds){console.log(selectedRowIds[0])}
    
</script>
        
<DataTable title="Responsabilidades" description="Seleccione la responsabilidad completada" sortable radio bind:selectedRowIds {headers} {rows} />

<TextArea placeholder="Anexe link de soporte y en caso de ser necesario anexe algún comentario" bind:value={description}/>

<Button>Enviar</Button>
