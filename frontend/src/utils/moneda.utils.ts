
export class FormateadorMoneda {
  private static readonly formateadorArs = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private static readonly formateadorEntero = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  });

  public static formatearConDecimales(valor: number): string {
    return this.formateadorArs.format(valor);
  }

  public static formatearPrecioMenu(valor: number): string {
    return `$${this.formateadorEntero.format(valor)}`;
  }
}

export function formatearMoneda(valor: number): string {
  return FormateadorMoneda.formatearConDecimales(valor);
}
