import { test, expect } from '@playwright/test';

test.describe('Flujo E2E: Catálogo de Café', () => {
  test('el usuario arma un café en móvil y ve el precio correcto', async ({ page }) => {
   
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

    
    await page.route('**/productos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1, 
            nombre: 'Expreso Mediano Colombia', 
            tipo: 'CAFE_EXPRESO',
            precioBase: 6000, 
            precio: 7360, 
            tamano: 'MEDIANO', 
            gramos: 27, 
            variedad: 'COLOMBIA', 
            descripcionVariedad: 'Acidez media, notas cítricas.'
          },
          {
            id: 2,
            nombre: 'Muffin de chocolate',
            tipo: 'PASTELERIA',
            precioBase: 3500,
            precio: 3500
          }
        ])
      });
    });

    
    await page.goto('/');

    
    await expect(page.getByText(/Armá/i)).toBeVisible({ timeout: 5000 });

    
    await page.getByLabel(/Expreso/i).check();
    await page.getByLabel(/Mediano/i).check();
    await page.getByLabel(/Colombia/i).check();

    
    await expect(page.getByText('$ 7.360,00').first()).toBeVisible();
    
    
    const btnAgregar = page.getByRole('button', { name: /Agregar al carrito/i });
    await expect(btnAgregar).toBeEnabled();

    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  });
});