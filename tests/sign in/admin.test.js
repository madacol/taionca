import { expect, test } from '@playwright/test';

test('login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.getByPlaceholder('Ingrese su usuario...').click();
    await page.getByPlaceholder('Ingrese su usuario...').fill('admin');
    await page.getByPlaceholder('Ingrese su contraseña...').click();
    await page.getByPlaceholder('Ingrese su contraseña...').fill('admin');
    
    expect(await page.context().cookies()).toHaveLength(0);
    
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    
    // wait for navigation
    await page.waitForURL('/')

    // check cookie has been set
    expect(await page.context().cookies()).toHaveLength(1);
    await page.context().storageState({ path: 'tests/.auth/admin.json' });
});