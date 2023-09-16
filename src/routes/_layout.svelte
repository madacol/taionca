<script>
	import Logout32 from "carbon-icons-svelte/lib/Logout32";
	import { onMount } from 'svelte';
	import { session, notifications } from '../stores';
	import { apiFetch, checkPermissions } from '../functions';
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
			USERS_CREATE,
			PRESIDENT,
			ODT_READ,
			USERS_READ
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
			Content,
			InlineNotification,
			ToastNotification,
		} from "carbon-components-svelte";
	import Loader from "../components/Loader.svelte";

	function logout(){
		fetch("/api/user", {
			method: "DELETE"
		});
		$session = null;
		goto("/");
	}

	onMount(async ()=>{
		const result = await apiFetch("/api/user");
		$session = result.session;
	})

	$: user_permissions = ($session && $session.permissions) || [];

	let isSideNavOpen = false;
	let isOpen = false;

</script>

<style>
	.notifications{
		position: fixed;
		display: flex;
		flex-direction: column-reverse;
		bottom: 0;
		right: 0;
		
	}
</style>
  
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

			<SideNavMenu text="Gestión de usuarios">
				{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<SideNavMenuItem href="signup" text="Crear usuario" />{/if}
				{#if checkPermissions([ODT_CREATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_clients" text="Crear cliente" />{/if}
				{#if checkPermissions([USERS_READ[1]], user_permissions)}<SideNavMenuItem href="asignar_responsabilities" text="Asignar responsabilidad" />{/if}
				{#if checkPermissions([USERS_READ[1]], user_permissions)}<SideNavMenuItem href="ingreso_responsabilities" text="Crear responsabilidad" />{/if}
				{#if checkPermissions([USERS_READ[1]], user_permissions)}<SideNavMenuItem href="approve_responsabilities" text="Aprobar responsabilidad" />{/if}
				<SideNavMenuItem href="responsabilities" text="Responsabilidades" />
				<SideNavMenuItem href="attendance" text="Asistencia" />
				{#if checkPermissions([ODT_CREATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="asign_hours_odt" text="Horas por ODT" />{/if}
				{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="loans" text="Gestión de deudas" />{/if}
				{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="give_loans" text="Dar préstamos" />{/if}
				{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="pay_loans" text="Pagar préstamos" />{/if}
			</SideNavMenu>

			{#if checkPermissions([ODT_CREATE[1]], user_permissions) || checkPermissions([ODT_UPDATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de ODTs">
					{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="limit_resources" text="Limitación de recursos" />{/if}
					{#if checkPermissions([ODT_READ[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="odt_quotation" text="Nueva cotización"/>{/if}
					{#if checkPermissions([ODT_CREATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="nueva_odt" text="Nueva ODT"/>{/if}
					{#if checkPermissions([ODT_UPDATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="cerrar_odt" text="Cerrar ODT"/>{/if}
					{#if checkPermissions([ODT_READ[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="open_odts_review" text="Registro ODTs abiertas"/>{/if}
					{#if checkPermissions([ODT_READ[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="quotations_review" text="Registro cotizaciones"/>{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([INV_ODT_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([GENERAL_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}
				<SideNavMenu text="Gestión de gastos">
					{#if checkPermissions([GENERAL_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="gastos_generales" text="Gastos generales"/>{/if}
					{#if checkPermissions([ADMIN_EXPENSES_CREATE[1]], user_permissions) || checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<SideNavMenuItem href="gasto_admin" text="Gastos administrativos" />{/if}
					{#if checkPermissions([INV_ODT_EXPENSES_CREATE[1]], user_permissions)}<SideNavMenuItem href="gasto_inventario" text="Gastos de inventario" />{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions) || checkPermissions([PRESIDENT[1]], user_permissions) || checkPermissions([STOCKS_READ[1]], user_permissions)}
				<SideNavMenu text="Gestión monetaria">
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<SideNavMenuItem href="cambio_moneda" text="Cambios de moneda"/>{/if}
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions)}<SideNavMenuItem href="money_transfer" text="Transferencias"/>{/if}
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions) || checkPermissions([STOCKS_READ[1]], user_permissions)}<SideNavMenuItem href="balances" text="Balance"/>{/if}
					{#if checkPermissions([EXCHANGE_CURRENCY_CREATE[1]], user_permissions) || checkPermissions([STOCKS_READ[1]], user_permissions)}<SideNavMenuItem href="balance_registers" text="Registros de balances"/>{/if}
					{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="create_account" text="Crear cuenta bancaria"/>{/if}
					{#if checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="movements_review" text="Cierre"/>{/if}
					{#if checkPermissions([STOCKS_READ[1]], user_permissions)}<SideNavMenuItem href="payroll" text="Nómina"/>{/if}
				</SideNavMenu>
			{/if}

			{#if checkPermissions([STOCKS_READ[1]], user_permissions) || checkPermissions([INV_PURCHASES_CREATE[1]], user_permissions) || checkPermissions([STOCKS_CREATE[1]], user_permissions) || checkPermissions([STORAGES_CREATE[1]], user_permissions) || checkPermissions([PRESIDENT[1]], user_permissions)}
				<SideNavMenu text="Gestión de inventario">
					{#if checkPermissions([STOCKS_READ[1]], user_permissions) || checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="inventory_review" text="Registro de iventario"/>{/if}
					{#if checkPermissions([STOCKS_READ[1]], user_permissions) || checkPermissions([PRESIDENT[1]], user_permissions)}<SideNavMenuItem href="control_inv" text="Control de inventario"/>{/if}
					{#if checkPermissions([INV_PURCHASES_CREATE[1]], user_permissions)}<SideNavMenuItem href="reposicion_inv" text="Reposicion de Inventario"/>{/if}
					{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_spendable_inv" text="Ingreso de Inventario consumible"/>{/if}
					{#if checkPermissions([STOCKS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_no_spendable_inv" text="Ingreso de Inventario no consumible"/>{/if}
					{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_storages" text="Registrar almacenes"/>{/if}
					{#if checkPermissions([USERS_CREATE[1]], user_permissions)}<SideNavMenuItem href="ingreso_suppliers" text="Registrar proveedores"/>{/if}
				</SideNavMenu>
			{/if}
			
		{/if}
	</SideNavItems>
	
  </SideNav>
  
  <Content>
	  <slot></slot>
  </Content>

<div class="notifications">
	{#each $notifications as notification, index (index)}
		{#if notification}
			{#if notification.caption}
				<ToastNotification {...notification}/>
			{:else}
				<InlineNotification {...notification}/>
			{/if}
		{/if}
	{/each}
	<!-- {#if $notifications}<ToastNotification {...$notifications} /> {/if} -->
</div>

<Loader></Loader>
