<script>
	import { Button } from "carbon-components-svelte";
	import 'carbon-components-svelte/css/white.css';
	import SelectSearch from '../components/Select.svelte';
	import { TextInput } from "carbon-components-svelte";
	import { TextArea } from "carbon-components-svelte";
	import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } 
  	from "carbon-components-svelte";
	  
	let opts;
	let currency;

	let articles = [
	{value: 'electrodo', label: 'Electrodo'},
	{value: 'discoesmeril', label: 'Disco de esmeril'},
	{value: 'oxigeno', label: 'Oxigeno'},
	{value: 'gas', label: 'Gas'},
	{value: 'electrododesnudo', label: 'Electrodo desnudo'},
	{value: 'electrodorecubierto', label: 'Electrodo recubierto'},
	{value: 'cintaaislante', label: 'Cinta Aislante'}
	];
	  
  	const ACCOUNTS = {
		  dolar: [
		  {value: 'cajachica', label: 'Caja Chica'},
		  {value: 'chase', label: 'Chase'},
		  {value: 'revolut', label: 'Revolut'}
		  ],
	  
		  bolivar: [
		  {value: 'cajachica', label: 'Caja Chica'},
		  {value: 'bod', label: 'Bod'},
		  {value: 'venezuela', label: 'Venezuela'},
		  {value: 'provincial', label: 'Provincial'},
		  {value: 'banesco', label: 'Banesco'},
		  {value: 'mercantil', label: 'Mercantil'}
		  ],
	  
		  peso: [
		  {value: 'cajachica', label: 'Caja Chica'},
		  {value: 'davivienda', label: 'Davivienda'}
		  ],
	  
		  euro: [
		  {value: 'cajachica', label: 'Caja Chica'},
		  {value: 'revolut', label: 'Revolut'}
		  ],
	  
		  bitcoin: [
		  {value: 'btc', label: 'Bitcoin'}
		  ]
	  }

	let pays = [
	{value: 'pago1', label: 'Pagos a Marisol'},
	{value: 'pago2', label: 'Pagos a IVA'},
	{value: 'pago3', label: 'Pagos a Alcaldía'},
	{value: 'pago4', label: 'Pagos a IVSS'},
	{value: 'pago5', label: 'Pagos a INPSASEL'}
	];

	$: account = ACCOUNTS[currency];

</script>

<FormGroup legendText="Tipo de gasto">
	<RadioButtonGroup bind:selected={opts}>
		<RadioButton labelText="Inventariado" value="inventoried" />
		<RadioButton labelText="Recurrentes" value="recurrent" />
		<RadioButton labelText="Otros" value="others" />
	</RadioButtonGroup>
</FormGroup>

{#if opts==="inventoried"}

	<TextInput labelText="Cantidad gastada" placeholder="Ingrese la cantidad gastada..." />
	<SelectSearch placeholder="Artículos..." items={articles}/>

{:else if opts==="recurrent"}

	<SelectSearch placeholder="Transacciones..." items={pays}/>

{:else if opts==="others"}

	<TextInput labelText="Nombre de Gasto" placeholder="Ingrese la nombre del gasto..." />
	<TextInput labelText="Monto" placeholder="Ingrese el monto del gasto..." />

	<FormGroup legendText="Moneda">
		<RadioButtonGroup bind:selected={currency}>
			<RadioButton labelText="Dólares $" value="dolar" />
			<RadioButton labelText="Bolívares Bs" value="bolivar" />
			<RadioButton labelText="Pesos COP" value="peso" />
			<RadioButton labelText="Euros €" value="euro" />
			<RadioButton labelText="Bitcoin BTC" value="bitcoin" />
		</RadioButtonGroup>
	</FormGroup>

	<SelectSearch placeholder="Cuentas..." items={account}/>

	<TextArea labelText="Descripción" placeholder="Ingrese la descripción del gasto..." />

{/if}

<Button>Enviar</Button>