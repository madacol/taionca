<script>
	import Logout32 from "carbon-icons-svelte/lib/Logout32";
	import { onMount } from 'svelte';
	import { session } from '../stores';
	import { checkPermissions } from '../functions';
	import { goto } from '@sapper/app'
	import {ADMIN_EXPENSES_CREATE,
			EXCHANGE_CURRENCY_CREATE,
			GENERAL_EXPENSES_CREATE,
			INV_ODT_EXPENSES_CREATE,
			INV_PURCHASES_CREATE,
			ODT_CREATE,
			ODT_UPDATE,
			STOCKS_CREATE,
			STOCKS_READ,
			STORAGES_CREATE,
			USERS_CREATE
		} from '../constants/PERMISSIONS';

	import {
			Header,
			HeaderUtilities,
			HeaderAction,
			HeaderGlobalAction,
			HeaderPanelLinks,
			HeaderPanelDivider,
			HeaderPanelLink,
			SideNav,
			SideNavItems,
			SideNavMenu,
			SideNavMenuItem,
			SideNavLink,
			SkipToContent,
			Content
		} from "carbon-components-svelte";

	function logout(){
		fetch("/api/user", {
			method: "DELETE"
		});
		$session = null;
		goto("/");
	}

	onMount(async ()=>{
		const response = await fetch("/api/user");
		const result = await response.json();
		$session = result.session;
	})

	$: user_permissions = ($session && $session.permissions) || [];

  
	let isSideNavOpen = false;
	let isOpen = false;

</script>
  
  <Header company="Taionca" platformName="Página Web" bind:isSideNavOpen >

	<div slot="skip-to-content">
	  <SkipToContent/>
	</div>

	<HeaderUtilities>
		
		{#if $session}
			<HeaderAction bind:isOpen >
	
			<HeaderPanelLinks >
	
				<HeaderPanelDivider>Preferencias de Usuario</HeaderPanelDivider>
				<HeaderPanelLink href="change_password">Cambiar contraseña</HeaderPanelLink>
	
			</HeaderPanelLinks>
	
			</HeaderAction>
			
			<HeaderGlobalAction on:click={logout} aria-label="Settings" iconDescription="Cerrar sesión" icon={Logout32}/>
		{/if}

		</HeaderUtilities>

  </Header>

  
  <SideNav bind:isOpen={isSideNavOpen}>

	<SideNavItems>
		{#if !$session}
			<SideNavLink href="login" text="Inicio de sesión" />
		{:else}

			{#if checkPermissions([USERS_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de usuarios">
					{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<SideNavMenuItem href="signup" text="Crear usuarios" />{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([ODT_CREATE[1]], user_permissions) || checkPermissions([ODT_UPDATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de ODTs">
					{#if checkPermissions([ODT_CREATE[1]], user_permissions)}<SideNavMenuItem href="nueva_odt" text="Nueva ODT"/>{/if}
					{#if checkPermissions([ODT_UPDATE[1]], user_permissions)}<SideNavMenuItem href="cerrar_odt" text="Cerrar ODT"/>{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([INV_ODT_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([GENERAL_EXPENSES_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de gastos">
					{#if checkPermissions([INV_ODT_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="gasto_inventario" text="Gasto de inventario" />{/if}
					{#if checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="gasto_admin" text="Gasto administrativo" />{/if}
					{#if checkPermissions([GENERAL_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="gastos_generales" text="Gastos generales"/>{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions) || checkPermissions([USERS_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión monetaria">
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<SideNavMenuItem href="cambio_moneda" text="Cambios de moneda"/>{/if}
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<SideNavMenuItem href="balances" text="Balance"/>{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([STOCKS_READ[1]], user_permissions) || checkPermissions([INV_PURCHASES_CREATE[1]], user_permissions) || checkPermissions([STOCKS_CREATE[1]], user_permissions) || checkPermissions([STORAGES_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de inventario">
					{#if checkPermissions([STOCKS_READ[1]], user_permissions)}<SideNavMenuItem href="control_inv" text="Control de inventario"/>{/if}
					{#if checkPermissions([INV_PURCHASES_CREATE[1]], user_permissions)}<SideNavMenuItem href="reposicion_inv" text="Reposicion de Inventario"/>{/if}
					{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_spendable_inv" text="Ingreso de Inventario consumible"/>{/if}
					{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_no_spendable_inv" text="Ingreso de Inventario no consumible"/>{/if}
					{#if checkPermissions([STORAGES_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_storages" text="Registrar almacenes"/>{/if}
					{#if checkPermissions([STORAGES_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_suppliers" text="Registrar proveedores"/>{/if}
				</SideNavMenu>
			{/if}
			
		{/if}
	</SideNavItems>
	
  </SideNav>
  
  <Content>
	<slot></slot>
  </Content>