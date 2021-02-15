<script>
	export let segment;
	import 'carbon-components-svelte/css/white.css';
	import { Button } from "carbon-components-svelte";
	import Logout32 from "carbon-icons-svelte/lib/Logout32";

	function logout(){
		fetch("/api/user", {
			method: "DELETE"
		})
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}

	div {
		display: flex;
		flex-direction: row;
	}
</style>

<div>
	<nav>
		<ul>
			<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Inicio</a></li>
			<li><a aria-current="{segment === 'login' ? 'page' : undefined}" href="login">Inicio de sesión</a></li>
			<li><a aria-current="{segment === 'signup' ? 'page' : undefined}" href="signup">Resgistrar nuevo Usuario</a></li>
			<li><a aria-current="{segment === 'gasto_inventario' ? 'page' : undefined}" href="gasto_inventario">Gasto de inventario</a></li>
			<li><a aria-current="{segment === 'gasto_admin' ? 'page' : undefined}" href="gasto_admin">Gasto administrativo</a></li>
			<li><a aria-current="{segment === 'gastos_generales' ? 'page' : undefined}" href="gastos_generales">Gastos generales</a></li>
			<li><a aria-current="{segment === 'nueva_odt' ? 'page' : undefined}" href="nueva_odt">Nueva ODT</a></li>
			<li><a aria-current="{segment === 'cambio_moneda' ? 'page' : undefined}" href="cambio_moneda">Cambios de moneda</a></li>
			<li><a aria-current="{segment === 'solicitud_cambio_moneda' ? 'page' : undefined}" href="solicitud_cambio_moneda">Solicitud de cambios de moneda</a></li>
			<li><a aria-current="{segment === 'solicitud_prestamo' ? 'page' : undefined}" href="solicitud_prestamo">Solicitud de prestamos</a></li>
			<li><a aria-current="{segment === 'lista_responsabilidades' ? 'page' : undefined}" href="lista_responsabilidades">Responsabilidades</a></li>
			<li><a aria-current="{segment === 'asistencia' ? 'page' : undefined}" href="asistencia">Asistencia</a></li>
			<li><a aria-current="{segment === 'deudas' ? 'page' : undefined}" href="deudas">Deudas</a></li>
			<li><a aria-current="{segment === 'aprovaciones' ? 'page' : undefined}" href="aprovaciones">Aprovaciones</a></li>
			<li><a aria-current="{segment === 'reposicion_inv' ? 'page' : undefined}" href="reposicion_inv">Reposicion de Inventario</a></li>
			<li><a aria-current="{segment === 'control_inv' ? 'page' : undefined}" href="control_inv">Control de Inventario</a></li>
			<li><a aria-current="{segment === 'ingreso_spendable_inv' ? 'page' : undefined}" href="ingreso_spendable_inv">Ingreso de Inventario consumible</a></li>
			<li><a aria-current="{segment === 'ingreso_no_spendable_inv' ? 'page' : undefined}" href="ingreso_no_spendable_inv">Ingreso de Inventario no consumible</a></li>
		</ul>
	</nav>
	
	<Button on:click={logout} kind="ghost" iconDescription="Cerrar sesión" icon={Logout32}></Button>

</div>
