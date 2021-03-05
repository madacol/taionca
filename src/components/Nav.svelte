<script>
	export let segment;
	import 'carbon-components-svelte/css/white.css';
	import { Button } from "carbon-components-svelte";
	import Logout32 from "carbon-icons-svelte/lib/Logout32";
	import { onMount } from 'svelte';
	import { session } from '../stores';
	import { checkPermissions } from '../functions';
	import { ADMIN_EXPENSES_CREATE,
			 EXCHANGE_CURRENCY_CREATE,
			 GENERAL_EXPENSES_CREATE, 
			 INV_ODT_EXPENSES_CREATE, 
			 INV_PURCHASES_CREATE, 
			 NEW_ODT_CREATE, 
			 STOCKS_CREATE, 
			 STOCKS_READ, 
			 STORAGES_CREATE, 
			 USERS_CREATE } from '../constants/PERMISSIONS';

	function logout(){
		fetch("/api/user", {
			method: "DELETE"
		});
		$session = null;
	}

	onMount(async ()=>{
		const response = await fetch("/api/user");
		const result = await response.json();
		$session = result.session;
	})

	$: user_permissions = ($session && $session.permissions) || [];

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
			{#if !$session}
				<li><a aria-current="{segment === 'login' ? 'page' : undefined}" href="login">Inicio de sesión</a></li>
			{:else}
				<li><a aria-current="{segment === 'update_user_info' ? 'page' : undefined}" href="update_user_info">Actualizar información de usuario</a></li>
				<!-- <li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">Inicio</a></li> -->
				{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'signup' ? 'page' : undefined}" href="signup">Resgistrar nuevo Usuario</a></li>{/if}
				{#if checkPermissions([INV_ODT_EXPENSES_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'gasto_inventario' ? 'page' : undefined}" href="gasto_inventario">Gasto de inventario</a></li>{/if}
				{#if checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'gasto_admin' ? 'page' : undefined}" href="gasto_admin">Gasto administrativo</a></li>{/if}
				{#if checkPermissions([GENERAL_EXPENSES_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'gastos_generales' ? 'page' : undefined}" href="gastos_generales">Gastos generales</a></li>{/if}
				{#if checkPermissions([NEW_ODT_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'nueva_odt' ? 'page' : undefined}" href="nueva_odt">Nueva ODT</a></li>{/if}
				{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'cambio_moneda' ? 'page' : undefined}" href="cambio_moneda">Cambios de moneda</a></li>{/if}
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'solicitud_cambio_moneda' ? 'page' : undefined}" href="solicitud_cambio_moneda">Solicitud de cambios de moneda X</a></li>{/if} -->
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'solicitud_prestamo' ? 'page' : undefined}" href="solicitud_prestamo">Solicitud de prestamos X</a></li>{/if} -->
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'lista_responsabilidades' ? 'page' : undefined}" href="lista_responsabilidades">Responsabilidades X</a></li>{/if} -->
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'asistencia' ? 'page' : undefined}" href="asistencia">Asistencia X</a></li>{/if} -->
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'deudas' ? 'page' : undefined}" href="deudas">Deudas X</a></li>{/if} -->
				<!-- {#if checkPermissions([USERS_READ[1]], id_user_permissions)}<li><a aria-current="{segment === 'aprovaciones' ? 'page' : undefined}" href="aprovaciones">Aprovaciones X</a></li>{/if} -->
				{#if checkPermissions([INV_PURCHASES_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'reposicion_inv' ? 'page' : undefined}" href="reposicion_inv">Reposicion de Inventario</a></li>{/if}
				{#if checkPermissions([STOCKS_READ[1]], user_permissions)}<li><a aria-current="{segment === 'control_inv' ? 'page' : undefined}" href="control_inv">Control de Inventario</a></li>{/if}
				{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'ingreso_spendable_inv' ? 'page' : undefined}" href="ingreso_spendable_inv">Ingreso de Inventario consumible</a></li>{/if}
				{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'ingreso_no_spendable_inv' ? 'page' : undefined}" href="ingreso_no_spendable_inv">Ingreso de Inventario no consumible</a></li>{/if}
				{#if checkPermissions([STORAGES_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'ingreso_storages' ? 'page' : undefined}" href="ingreso_storages">Ingreso de Almacenes</a></li>{/if}
				{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<li><a aria-current="{segment === 'balances' ? 'page' : undefined}" href="balances">Saldo de cuentas</a></li>{/if}
			{/if}
		</ul>
	</nav>
	{#if $session}
		<Button on:click={logout} kind="ghost" iconDescription="Cerrar sesión" icon={Logout32} href="login"></Button>
	{/if}

</div>
