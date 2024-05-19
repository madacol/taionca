<script>
	import 'carbon-components-svelte/css/white.css';
    import { DatePickerInput } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
    import Entitys from '../components/Entitys.svelte';
    import OpenOdts from '../components/Open_odts.svelte';
    import Chart from '../components/Charts.svelte';
    import { apiFetch } from '../functions';
	
	let DatePicker;
	let start_date;
	let end_date;
	let id_entity;
	let balance_registers
	let line_chart_settings;
	let range_date;

	onMount(async ()=>{
        if (!DatePicker) DatePicker = (await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte')).default;
		// ({balance_registers} = await apiFetch('/api/public/balance_registers_charts'));
	})

	async function get_balance_registers(){
		range_date ={
			start_date,
			end_date
		}
		console.log(range_date)
		({balance_registers} = await apiFetch(`/api/public/balance_registers_charts/${range_date}`));
	}
$: if(start_date && end_date){
	console.log(start_date, end_date)
	get_balance_registers()
}

const accounts = {}
	$: if(balance_registers){
		console.log(balance_registers)
		for (const balance_change of balance_registers) {
		
			const { balance, created_at, id_balance } = balance_change
		
			for (const key in accounts) {
				const balances = accounts[key]
				// repeat the last balance on each account with the new timestamp4
				const last_balance = structuredClone(balances[balances.length - 1])
				last_balance.x = created_at;
				balances.push(last_balance)
			}
		
			if (!accounts[id_balance]) {
				accounts[id_balance] = []
			}
			
			// And now we add the new balance to the account that changed in this timestamp
			accounts[id_balance].push(
				{ 
				x: created_at,
				y: balance,
			})
		}
			let doughnut_chart_settings;
			let datasets = [];
			let account_chart;
		
			let keys = Object.keys(accounts)
			keys.forEach(key => {
				console.log(key)
				account_chart = accounts[key]
				datasets.push({
					data: account_chart,
					tension: 0
				})
			})
		
			line_chart_settings = {
				type: 'line',
		
				data: {
					datasets
				},
		
		
				options:{
					legend: {display: false},
					maintainAspectRatio: false,
					tooltips: {
						mode: 'nearest',
						intersect: false
					},
					scales: {
						x: {
							type: 'time',
							// time: {
							// 	displayFormats: {
							// 		hour: 'ddd hA',
							// 	},
							// 	tooltipFormat: 'MMM DD HH:mm',
							// },
						}
					},
				},
			}	
	}
</script>

<style>
	.OnSameLine{
		display: flex;
		justify-content: space-around;
	}

	.OnSameLine > :global(*){
		width: 100%;
	}
</style>
<div class="OnSameLine">
	<div>
		<div class="OnSameLine">
			{#if DatePicker}
				<svelte:component this={DatePicker} bind:value={start_date} datePickerType="single" locale={navigator.language}>
					<DatePickerInput placeholder="Fecha inicial" />
				</svelte:component>
				<svelte:component this={DatePicker} bind:value={end_date} datePickerType="single" locale={navigator.language}>
					<DatePickerInput placeholder="Fecha final" />
				</svelte:component>
			{/if}	
		</div>
		
		<Entitys bind:entity={id_entity}/>
		
		<div style="width: 1500px; height: 500px;">
			{#if line_chart_settings}
				<Chart chart_settings = {line_chart_settings}/>
			{/if}
		</div>
		<OpenOdts/>
	</div>

	<div>
		<OpenOdts/>
		<div style="max-width: 600px;">
			<!-- <Chart {doughnut_chart_settings}/> -->
		</div>
	</div>
</div>