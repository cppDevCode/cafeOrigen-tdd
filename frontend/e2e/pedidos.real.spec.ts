import { test, expect } from '@playwright/test';
import { prepararDatos } from './fixtures/prepararDatos';

test.describe('Pedidos - E2E real', () => {
    test.beforeEach(() => {
        prepararDatos();
    });

    test('permite configurar un café y confirmar un pedido real', async ({ page }) => {
    // abrir app
    await page.goto('/?mesa=4');

    // esperar que cargue manu
    const menu = page.getByRole('region', {
        name: /menú de productos/i,
    });

    await expect(menu).toBeVisible();

    // configurar cafe
    await menu.getByRole('button', { name: 'Expreso', exact: true }).click();
    await menu.getByRole('button', { name: 'Pocillo', exact: true }).click();
    await menu.getByRole('button', { name: /^Brasil\b/i }).click();

    // agregar al carrito
    await menu.getByRole('button', {
        name: /Agregar Expreso Pocillo Brasil al carrito/i,
    }).click();

    // verificar que aparece en el carrito
    const carrito = page.getByRole('region', { name: 'Carrito' });

    await expect(carrito).toContainText('Expreso Pocillo Brasil');
    await expect(carrito).toContainText('Cantidad: 1');

    // confirmar pedido
    await carrito.getByRole('button', {
        name: 'Confirmar pedido',
    }).click();

    // chequear confirmacion
    const seguimiento = page.getByRole('region', {
        name: 'Seguimiento del pedido',
    });

    await expect(seguimiento).toBeVisible();
    await expect(
        seguimiento.getByRole('heading', { name: /^Pedido #\d+$/ }),
    ).toBeVisible();

    await expect(seguimiento).toContainText('Estado:');
    await expect(seguimiento).toContainText('Total del pedido:');

    // consultar estado de pedodo
    await seguimiento.getByRole('button', {
        name: 'Actualizar estado',
        }).click();

        await expect(seguimiento).toContainText('Estado:');
        // obtener id pedido
        const tituloPedido = await seguimiento
        .getByRole('heading', { name: /^Pedido #\d+$/ })
        .innerText();

        const pedidoId = Number(tituloPedido.match(/\d+/)?.[0]);

        expect(pedidoId).toBeGreaterThan(0);

        // consultar pedido en api
        const respuesta = await page.request.get(
        `http://localhost:3002/api/pedidos/${pedidoId}`
        );

        expect(respuesta.ok()).toBeTruthy();

        const pedidoGuardado = await respuesta.json();

        // validar que es el pedido de la interfaz
        expect(pedidoGuardado.id).toBe(pedidoId);

        await expect(seguimiento).toContainText(
        `Estado: ${pedidoGuardado.estado}`
        );

        await expect(seguimiento).toContainText(
        `Total del pedido: $${pedidoGuardado.total}`
        );
        });
});