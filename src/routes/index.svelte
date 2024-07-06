<script>
	import 'carbon-components-svelte/css/white.css';
    import { Button, ContentSwitcher, DatePickerInput, Switch } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
    import Entitys from '../components/Entitys.svelte';
    import OpenOdts from '../components/Open_odts.svelte';
    import Chart from '../components/Charts.svelte';
    import { apiFetch } from '../functions';
    import Closed_odts_review from '../components/Closed_odts_review.svelte';
    import Currency from '../components/Currency.svelte';
    import Accounts from '../components/Accounts.svelte';
	
	let DatePicker;
	let start_date = new Date(new Date()-1000*60*60*24*30); // 30 days ago
	let end_date = new Date(); // Today (Until this exact moment)
	let id_entity;
	let line_chart_settings;
	let range_date;
	let currency;
	let total = [];
	let reset_zoom = false;
	let selectedIndex;
	let account;
	// let iterator = 1;

	onMount(async ()=>{
        if (!DatePicker) DatePicker = (await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte')).default;
	})
	
	function filter_by_currency(balance_registers, currency){
		if(currency && currency.id_currency){
			return balance_registers.filter(x => x.id_currency === currency.id_currency)
		}
	}
	$: if(start_date && end_date && (id_entity || account)){
		(async ()=>{
			range_date ={
				start_date: new Date(start_date),
				end_date: new Date(new Date(end_date) + (1000*60*60*24))
			}
			let {balance_registers1, balance_registers} = await apiFetch(`/api/public/balance_registers_charts/${JSON.stringify(range_date)}`);
			
			let id_balances = balance_registers.map(data => data.id_balance)
			id_balances = [...new Set(id_balances)]
			
			balance_registers.unshift(...balance_registers1.filter(x => id_balances.includes(x.id_balance)))
			
			set_data(filter_by_currency(balance_registers, currency));
		})()
	}

	function set_data(balance_registers){
		if(balance_registers && balance_registers.length > 0 && currency){

			let accounts = {}
			let id_entity_value;
			let account_value;
			let balance_registers_filtered;
			if(id_entity && selectedIndex === 0) {
				id_entity_value = id_entity.map(x => x.value)
				balance_registers_filtered = balance_registers.filter(x => id_entity_value.includes(x.id_entity))
			}

			if(account && selectedIndex === 1){
				account_value = account.map(x => x.value)
				balance_registers_filtered = balance_registers.filter(x => account_value.includes(x.id_account))
			}

			total = []

			for (const balance_register of balance_registers_filtered) {
				const { balance, created_at, id_balance, account_name, symbol, entity_name } = balance_register
				if (!accounts[id_balance]) {
					accounts[id_balance] = []
				}

				const last_account_balance = accounts[id_balance].at(-1)?.y || 0
				const last_total_balance = total.at(-1)?.y || 0
				const balance_change = Number(balance) - last_account_balance
				// let entities = balance_registers.map(data => data.entity_name)
				total.push({
					id_currency: currency.id_currency,
					label: `Total | (${symbol})`,
					x: created_at,
					y: last_total_balance + balance_change,
				})

				// And now we add the new balace to the account that changed in this timestamp
				accounts[id_balance].push(
					{ 
					...balance_register,
					label: `${entity_name} | ${account_name} (${symbol})`,
					x: created_at,
					y: Number(balance),
				})
			}

			for (const key in accounts) {
				const end_balance = structuredClone(accounts[key].at(-1))
				end_balance.x = end_date
				accounts[key].push(end_balance)
			}

			const end_total = structuredClone(total.at(-1))
			end_total.x = end_date
			total.push(end_total)

			accounts['total'] = total
			let keys = Object.keys(accounts)
			let datasets = [];
			let account_chart;
			
			keys.forEach(key => {
				if( key !== 'total' && Number(new Date(accounts[key][0].created_at)) === Number(new Date(total[0].x)) && Number(new Date(total[0].x)) === Number(new Date(total[1].x))){
					total.shift()
				}
			})

			keys.forEach(key => {
				account_chart = accounts[key]
				datasets.push({
					label: account_chart[0].label,
					data: account_chart,
					id_currency: account_chart[0].id_currency,
				})
			})

			datasets.forEach(dataset => {
				dataset.data = dataset.data.filter((value, index, self) =>
					index === self.findIndex((t) => (
						t.x === value.x && t.y === value.y
					))
				)
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
					stepped:true,
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
				    plugins: {
						zoom: {
							zoom: {
								wheel: {
									enabled: true,
								},
								pinch: {
									enabled: true,
								},
								mode: 'xy',
							},
							pan: {
									enabled: true,
									modifierKey: 'ctrl',
								},
						}
					}
				},
			}	
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
		<ContentSwitcher bind:selectedIndex >
			<Switch text="Entidades" />
			<Switch text="Cuentas" />
		</ContentSwitcher>
		{#if selectedIndex === 0}
			<Entitys bind:entity={id_entity} isMulti={true} default_entity={1}/>  <!--  Default value for Taionca-->
			<Currency bind:currency={currency} default_selection={1} on:change={set_data}/> <!--  Default value for dollars-->
		{/if}

		{#if selectedIndex === 1}
			<Accounts orientation="vertical" isMulti={true} bind:account={account} default_account={1}/>  <!--  Default value for Caja Chica-->
		{/if}

		<div style="min-width: 500px; max-width: 1500px; max-height: 1500px; min-height: 300px;">
			<Chart chart_settings = {line_chart_settings} bind:reset_zoom = {reset_zoom}/>
		</div>
		<Button on:click={() => reset_zoom = true} kind="ghost">Restablecer gráfico</Button>
		<div class="OnSameLine" style="font-weight: bold;">
			{#if total.length > 0}
				<h5>Saldo Inicial: {currency.symbol} {total[0].y.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
				<h5>Saldo Final: {currency.symbol} {total.at(-1).y.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h5>
			{/if}
		</div>
		{#if start_date && end_date}
			<Closed_odts_review is_filtered={true} start_date={start_date} end_date={end_date}/>
		{/if}
	</div>

	<div>
		<OpenOdts/>
		<div style="max-width: 600px;">
			<!-- <Chart {doughnut_chart_settings}/> -->
		</div>
	</div>
</div>