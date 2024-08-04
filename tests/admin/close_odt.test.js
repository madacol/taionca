import { test, expect } from '@playwright/test';

let id_odt;
let taionca_income = 2000;
let inv_income = 3000;
let balance_taionca;
let balance_inv;

test('open_new_odt', async ({ page }) => {
await page.goto('http://localhost:3000');

    await page.getByRole('button', { name: 'Gestión de ODTs Open Menu' }).click();
    await page.getByRole('link', { name: 'Nueva ODT' }).click();
    await page.getByPlaceholder('Ingrese el monto del contrato').click();
    await page.getByPlaceholder('Ingrese el monto del contrato').fill('10000');
    await page.locator('label').filter({ hasText: 'Dólares ($)' }).locator('span').first().click();
    await page.getByPlaceholder('Clientes...').click();
    await page.getByText('ZIC').click();
    await page.getByPlaceholder('Ingrese la descripción del').click();
    await page.getByPlaceholder('Ingrese la descripción del').fill('ODT de prueba');
    await page.getByRole('button', { name: 'Enviar' }).click();

    id_odt = (await page.getByText('ODT creada exitosamente con id').innerText()).split(' ')[5];
});

test('adding_money', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Gestión monetaria Open Menu' }).click();
    await page.getByRole('link', { name: 'Ingreso de dinero' }).click();
    await page.getByPlaceholder('Ingrese el ingreso total...').click();
    await page.getByPlaceholder('Ingrese el ingreso total...').fill(String(taionca_income));
    await page.getByPlaceholder('Entidades...').click();
    await page.locator('#main-content').getByText('Taionca').click();
    await page.getByPlaceholder('Cuentas...').click();
    await page.getByText('Caja Chica ($)').click();
    await page.getByPlaceholder('Ingrese la descripción del').click();
    await page.getByPlaceholder('Ingrese la descripción del').fill('ingreso de prueba');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await page.getByPlaceholder('Ingrese el ingreso total...').click();
    await page.getByPlaceholder('Ingrese el ingreso total...').fill(String(inv_income));
    await page.getByPlaceholder('Entidades...').click();
    await page.getByText('Inventario', { exact: true }).click();
    await page.getByPlaceholder('Cuentas...').click();
    await page.getByText('Caja Chica ($)').click();
    await page.getByPlaceholder('Ingrese la descripción del').click();
    await page.getByPlaceholder('Ingrese la descripción del').fill('ingreso de prueba');
    await page.getByRole('button', { name: 'Enviar' }).click();
});

test('get_balances', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Gestión monetaria Open Menu' }).click();
  await page.getByRole('link', { name: 'Balance', exact: true }).click();
  await page.getByPlaceholder('Entidades...').click();
  await page.locator('#main-content').getByText('Taionca').click();
  
  balance_taionca = parseFloat((await page.locator('tr', {hasText: '($) Caja Chica'}).locator('td').nth(1).innerText()).split(' ')[0]);
  
  await page.getByRole('textbox').click();
  await page.getByText('Inventario', { exact: true }).click();
  balance_inv = parseFloat((await page.locator('tr', {hasText: '($) Caja Chica'}).locator('td').nth(1).innerText()).split(' ')[0]);
});