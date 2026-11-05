import { test, expect } from '@playwright/test';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3002/api';

test.describe('Flujo E2E: Catálogo de Café', () => {
  test.beforeEach(async ({ request }) => {
    
    await request.post(`${API_URL}/__test__/reset`);
    await request.post(`${API_URL}/__test__/seed`);
  });

  test('el usuario arma un café en móvil y ve el precio correcto', async ({ page }) => {
    // 1. Vamos a la página principal
    await page.goto('/');

    // 2. Esperamos que cargue el catálogo
    await expect(page.getByText(/Armá tu Café/i)).toBeVisible();

    // 3. Simulamos la selección de los 3 pasos
    await page.getByLabel(/Expreso/i).check();
    await page.getByLabel(/Mediano/i).check();
    await page.getByLabel(/Colombia/i).check();

    // 4. Verificamos que muestre el precio
    await expect(page.getByText('$ 7.360,00')).toBeVisible();
    
    // 5. Verificamos que el botón esté habilitado
    const btnAgregar = page.getByRole('button', { name: /Agregar al carrito/i });
    await expect(btnAgregar).toBeEnabled();

    // 6. Verificamos que no haya scroll horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  });
});