<script>
    import 'carbon-components-svelte/css/white.css';
	import { tick } from 'svelte';
    import { Column, Grid, Row, TextInput} from "carbon-components-svelte";
	import { apiFetch } from '../functions';
    import Users from '../components/Users.svelte';
    import Button from 'carbon-components-svelte/src/Button/Button.svelte';
    import Accounts from '../components/Accounts.svelte';

	let user;
	let label = '';
	let account;
	let amount;
	let limit_resources;
	let limit_resources_filtered;

	async function update_limit_resources(amount, id_account){
		console.log(user);
		await apiFetch("/api/public/update_limit_resources",{
			method: 'POST',
			body: JSON.stringify({
				id_user: user.value,
				id_account,
				amount
			}),
			headers: {'Content-Type': 'application/json'}
		})
	}

	async function get_limit_resources(){
		({limit_resources} = await apiFetch('/api/public/get_limit_resources'));
		await tick();
		limit_resources_filtered = limit_resources.filter(({id_user}) => id_user === user.value);
		on_select_both();
	}

	function on_select_account(){
		label = account.name_plural;
		on_select_both();
	}

	function on_select_both(){
		if(account && user && limit_resources_filtered ){
			console.log(account.id_account);
			console.log(limit_resources_filtered[account.id_account])
			console.log(limit_resources_filtered)
			if(!limit_resources_filtered[account.id_account]){
				amount = 0;
			}else{
				amount = limit_resources_filtered[account.id_account].amount;
			}
		}
	}

</script>

<Grid narrow>
	<Row>
		<Column padding style="outline: 1px solid var(--cds-interactive-04)">
			<Users bind:user={user} on:select={get_limit_resources}/>
		</Column>
		<Column padding style="outline: 1px solid var(--cds-interactive-04)">
			<Accounts on:select={on_select_account} orientation="vertical" bind:account={account}/>
		</Column>
	</Row>
	<Row>
		<Column padding style="outline: 1px solid var(--cds-interactive-04)">
			<TextInput bind:value={amount} type="number" labelText="Monto límite en {label}" placeholder="Ingrese el monto..." />
		</Column>
		<Column padding style="outline: 1px solid var(--cds-interactive-04)">
			<Button on:click={update_limit_resources(amount, account.id_account)}>Enviar</Button>
		</Column>
	</Row>
</Grid>
