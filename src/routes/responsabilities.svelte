<script>
    import 'carbon-components-svelte/css/white.css';
    import { DataTable, Button, TextArea } from "carbon-components-svelte";
	import { apiFetch } from '../functions';
	import { onMount } from 'svelte';

	let awaiting_approval_responsibilitys = [];
	async function get_responsibilitys(){
		({awaiting_approval_responsibilitys} = await apiFetch('/api/public/not_approving_pending_responsibilitys'));
	}
	onMount(async ()=>{
		get_responsibilitys();
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
	let id = 0;
	let rows=[];
	$: if (awaiting_approval_responsibilitys && awaiting_approval_responsibilitys.length > 0){
		id = 0;
		rows = awaiting_approval_responsibilitys.map(responsibility => ({
			
			id: id++,
			name: responsibility.name,
			description: responsibility.description,
			importance: responsibility.importance,
			frequency: frequency_label(responsibility.term_label, responsibility.days_to_repeat),
			overdue: ( Date.parse(responsibility.deadline) - Date.parse(new Date().toLocaleDateString()) ) / ( 86400000 ), //Unix time between the deadline and actual date expressed in days
			date: new Date(responsibility.deadline).toLocaleDateString()
		}));
	}

    let description;
	let selectedRowIds;

	async function send_responsibility(){
		
		await apiFetch("/api/public/new_awaiting_approval_responsibility",{
			method: 'POST',
			body: JSON.stringify({
				id_pending_responsibility: awaiting_approval_responsibilitys[selectedRowIds[0]].id_pending_responsibility,
				description_evidence: description
			}),
			headers: {'Content-Type': 'application/json'}
		})

		get_responsibilitys();
		cleanWindows();
	}

	function cleanWindows(){
		description = "";
	}
    
</script>
        
<DataTable title="Responsabilidades" description="Seleccione la responsabilidad completada" sortable radio bind:selectedRowIds {headers} {rows} />

<TextArea placeholder="Anexe link de soporte y en caso de ser necesario anexe algún comentario" bind:value={description}/>

<Button on:click={send_responsibility}>Enviar</Button>
