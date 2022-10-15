<script>
	import 'carbon-components-svelte/css/white.css';
	import { Slider, Tabs, Tab, TabContent, TextInput} from "carbon-components-svelte";
	import { apiFetch } from '../functions';
    import Users from '../components/Users.svelte';

	let user;

</script>

<Users bind={user}/>
<Slider labelText="Porcentaje de gasto administrativo" step={0.5} min={0} max={30} minLabel="0%" maxLabel="30%"/>

<Tabs autoWidth>
	<Tab label="Tab label 1" />
	<Tab label="Tab label 2" />
	<Tab label="Tab label 3" />
	<svelte:fragment slot="content">
	  <TabContent> <TextInput/> </TabContent>
	  <TabContent>Content 2</TabContent>
	  <TabContent>Content 3</TabContent>
	</svelte:fragment>
</Tabs>