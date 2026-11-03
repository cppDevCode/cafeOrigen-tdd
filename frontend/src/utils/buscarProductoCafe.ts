
import type { Producto } from '../schemas/producto.schema';

export type TipoCafe = 'CAFE_EXPRESO' | 'CAFE_FILTRADO';
export type TamanoCafe = 'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE';
export type VariedadCafe = 'BRASIL' | 'COLOMBIA' | 'ETIOPIA';

export type ProductoCafe = Extract<Producto, { tipo: TipoCafe }>;
export type ProductoPasteleria = Extract<Producto, { tipo: 'PASTELERIA' }>;

export interface OpcionSelector<T extends string> {
  readonly valor: T;
  readonly etiqueta: string;
}

export class SeleccionCafe {
  constructor(
    public readonly tipo: TipoCafe = 'CAFE_EXPRESO',
    public readonly tamano: TamanoCafe = 'POCILLO',
    public readonly variedad: VariedadCafe = 'BRASIL'
  ) {}

  public conTipo(nuevoTipo: TipoCafe): SeleccionCafe {
    return new SeleccionCafe(nuevoTipo, this.tamano, this.variedad);
  }

  public conTamano(nuevoTamano: TamanoCafe): SeleccionCafe {
    return new SeleccionCafe(this.tipo, nuevoTamano, this.variedad);
  }

  public conVariedad(nuevaVariedad: VariedadCafe): SeleccionCafe {
    return new SeleccionCafe(this.tipo, this.tamano, nuevaVariedad);
  }

  public esTipo(tipo: TipoCafe): boolean {
    return this.tipo === tipo;
  }

  public esTamano(tamano: TamanoCafe): boolean {
    return this.tamano === tamano;
  }

  public esVariedad(variedad: VariedadCafe): boolean {
    return this.variedad === variedad;
  }

  public coincideCon(producto: Producto): producto is ProductoCafe {
    return (
      producto.tipo === this.tipo &&
      producto.tamano === this.tamano &&
      producto.variedad === this.variedad
    );
  }
}

export class CatalogoMenu {
  public static readonly OPCIONES_BEBIDA: readonly OpcionSelector<TipoCafe>[] = [
    { valor: 'CAFE_EXPRESO', etiqueta: 'Expreso' },
    { valor: 'CAFE_FILTRADO', etiqueta: 'Filtrado' },
  ];

  public static readonly OPCIONES_TAMANO: readonly OpcionSelector<TamanoCafe>[] = [
    { valor: 'POCILLO', etiqueta: 'Pocillo' },
    { valor: 'MEDIANO', etiqueta: 'Mediano' },
    { valor: 'TAZA_GRANDE', etiqueta: 'Taza grande' },
  ];

  public static readonly OPCIONES_ORIGEN: readonly OpcionSelector<VariedadCafe>[] = [
    { valor: 'COLOMBIA', etiqueta: 'Colombia' },
    { valor: 'ETIOPIA', etiqueta: 'Etiopía' },
    { valor: 'BRASIL', etiqueta: 'Brasil' },
  ];

  constructor(private readonly productos: readonly Producto[]) {}

  public obtenerCafes(): ProductoCafe[] {
    return this.productos.filter(
      (prod): prod is ProductoCafe =>
        prod.tipo === 'CAFE_EXPRESO' || prod.tipo === 'CAFE_FILTRADO'
    );
  }

  public obtenerPasteleria(): ProductoPasteleria[] {
    return this.productos.filter(
      (prod): prod is ProductoPasteleria => prod.tipo === 'PASTELERIA'
    );
  }

  public buscarCafe(seleccion: SeleccionCafe): ProductoCafe | undefined {
    return this.productos.find((prod): prod is ProductoCafe =>
      seleccion.coincideCon(prod)
    );
  }

  public buscarCafePorVariedad(
    seleccion: SeleccionCafe,
    variedad: VariedadCafe
  ): ProductoCafe | undefined {
    return this.buscarCafe(seleccion.conVariedad(variedad));
  }

  public obtenerDescripcionVariedad(
    seleccion: SeleccionCafe,
    variedad: VariedadCafe
  ): string {
    const exacto = this.buscarCafePorVariedad(seleccion, variedad);
    if (exacto) {
      return exacto.descripcionVariedad;
    }

    const cualquierDeVariedad = this.obtenerCafes().find(
      (cafe) => cafe.variedad === variedad
    );
    return (
      cualquierDeVariedad?.descripcionVariedad ??
      'Acidez, cuerpo y notas de origen seleccionado'
    );
  }

  public crearSeleccionInicial(): SeleccionCafe {
    const porDefecto = new SeleccionCafe('CAFE_EXPRESO', 'POCILLO', 'BRASIL');
    if (this.buscarCafe(porDefecto)) {
      return porDefecto;
    }

    const primerCafe = this.obtenerCafes()[0];
    if (primerCafe) {
      return new SeleccionCafe(
        primerCafe.tipo,
        primerCafe.tamano,
        primerCafe.variedad
      );
    }

    return porDefecto;
  }
}

export function buscarProductoCafe(
  productos: Producto[],
  tipo: TipoCafe,
  tamano: TamanoCafe,
  variedad: VariedadCafe
): Producto | undefined {
  return new CatalogoMenu(productos).buscarCafe(
    new SeleccionCafe(tipo, tamano, variedad)
  );
}
