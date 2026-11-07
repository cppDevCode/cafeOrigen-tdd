
import { test, expect } from '@playwright/test';

test.describe('Carrito y pedidos', () => {
    test('agrega productos, confirma el pedido y actualiza su estado', async ({ page }) => {
        let cuerpoPedido: unknown;
        let consultasEstado = 0;

        
    await page.route('**/api/productos', async (route) => {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
        {
            id: 1,
            nombre: 'Expreso Pocillo Brasil',
            tipo: 'CAFE_EXPRESO',
            precioBase: 2500,
            tamano: 'POCILLO',
            gramos: 18,
            variedad: 'BRASIL',
            descripcionVariedad: 'Café de origen brasileño',
            precio: 5020
        }
        ])
    });
});


        await page.route('**/api/pedidos', async (route) => {
        cuerpoPedido = route.request().postDataJSON();

        await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
            id: 15,
            mesaId: 4,
            estado: 'PENDIENTE',
            total: 5020,
            items: [
                {
                id: 1,
                productoId: 1,
                cantidad: 1,
                precioUnitario: 5020
                }
            ]
            })
        });
        });

        await page.route('**/api/pedidos/15', async (route) => {
        consultasEstado++;

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            id: 15,
            mesaId: 4,
            estado: 'EN_PREPARACION',
            total: 5020,
            items: [
                {
                id: 1,
                productoId: 1,
                cantidad: 1,
                precioUnitario: 5020
                }
            ]
            })
        });
        });

        await page.goto('/?mesa=4');
        
        await expect(
        page.getByTestId('modalidad-atencion')
        ).toHaveText('Mesa 4');

        await page.getByLabel(/Expreso/i).check();
        await page.getByLabel(/Pocillo/i).check();
        await page.getByLabel(/Brasil/i).check();

        await page.getByRole('button', {
        name: /Agregar al carrito/i
        }).click();

        const carrito = page.getByRole('region', { name: 'Carrito' });

        await expect(carrito.getByText('Cantidad: 1')).toBeVisible();

        await carrito.getByRole('button', {
        name: 'Confirmar pedido'
        }).click();

        await expect(
        page.getByRole('heading', { name: 'Pedido #15' })
        ).toBeVisible();

        expect(cuerpoPedido).toEqual({
        mesaId: 4,
        items: [{ productoId: 1, cantidad: 1 }]
        });

        await page.getByRole('button', {
        name: 'Actualizar estado'
        }).click();

        await expect(
        page.getByText('Estado: EN_PREPARACION')
        ).toBeVisible();

        expect(consultasEstado).toBe(1);
    });
});
