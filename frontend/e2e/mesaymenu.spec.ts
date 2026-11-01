import { test, expect, type Page, type Locator } from '@playwright/test';

class MenuPage {
  readonly badgeModalidad: Locator;
  readonly seccionMenu: Locator;

  constructor(private readonly page: Page) {
    this.badgeModalidad = page.getByTestId('modalidad-atencion');
    this.seccionMenu = page.getByRole('region', { name: /menú de productos/i });
  }

  async navegarConQr(mesa: number | string): Promise<void> {
    await this.page.goto(`/?mesa=${mesa}`);
  }

  async navegarSinQr(): Promise<void> {
    await this.page.goto('/');
  }

  productoPorNombre(nombre: RegExp): Locator {
    return this.page.getByText(nombre);
  }
}

test.describe('Integrante 1: Acceso QR y Menú (POM + Viewport 375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('muestra "Mesa 4" y el listado de productos al ingresar por QR válido', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.navegarConQr(4);

    await expect(menuPage.badgeModalidad).toHaveText('Mesa 4');
    await expect(menuPage.seccionMenu).toBeVisible();
    await expect(menuPage.productoPorNombre(/Muffin de chocolate/i)).toBeVisible();
  });

  test('hace fallback a "Retiro en barra" cuando el QR es inválido', async ({ page }) => {
    const menuPage = new MenuPage(page);
    await menuPage.navegarConQr('invalida');

    await expect(menuPage.badgeModalidad).toHaveText('Retiro en barra');
  });
});
