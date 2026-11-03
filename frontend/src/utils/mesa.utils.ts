export type MesaInfo =
  | { tipo: 'mesa'; numero: number; etiqueta: `Mesa ${number}` }
  | { tipo: 'barra'; numero: null; etiqueta: 'Retiro en barra' };

export abstract class ModalidadAtencion {
  abstract readonly tipo: 'mesa' | 'barra';
  abstract readonly numero: number | null;
  abstract readonly etiqueta: string;

  abstract esMesa(): boolean;
  abstract obtenerMesaId(): number | undefined;
  abstract toDTO(): MesaInfo;
}

export class AtencionEnMesa extends ModalidadAtencion {
  readonly tipo = 'mesa' as const;
  readonly numero: number;
  readonly etiqueta: `Mesa ${number}`;

  constructor(numero: number) {
    super();
    if (!Number.isSafeInteger(numero) || numero <= 0) {
      throw new Error('El número de mesa debe ser un entero positivo');
    }
    this.numero = numero;
    this.etiqueta = `Mesa ${numero}`;
  }

  esMesa(): boolean {
    return true;
  }

  obtenerMesaId(): number | undefined {
    return this.numero;
  }

  toDTO(): MesaInfo {
    return { tipo: this.tipo, numero: this.numero, etiqueta: this.etiqueta };
  }
}

export class RetiroEnBarra extends ModalidadAtencion {
  readonly tipo = 'barra' as const;
  readonly numero = null;
  readonly etiqueta = 'Retiro en barra' as const;

  esMesa(): boolean {
    return false;
  }

  obtenerMesaId(): number | undefined {
    return undefined;
  }

  toDTO(): MesaInfo {
    return { tipo: this.tipo, numero: this.numero, etiqueta: this.etiqueta };
  }
}

export class ParserMesaUrl {
  private static readonly REGEX_ENTERO_POSITIVO = /^[1-9]\d*$/;

  public static desdeSearchParams(searchParams: string): ModalidadAtencion {
    const params = new URLSearchParams(searchParams);
    const rawMesa = params.get('mesa')?.trim();

    if (!rawMesa || !this.REGEX_ENTERO_POSITIVO.test(rawMesa)) {
      return new RetiroEnBarra();
    }

    const numero = Number(rawMesa);
    if (!Number.isSafeInteger(numero)) {
      return new RetiroEnBarra();
    }

    return new AtencionEnMesa(numero);
  }
}

export function obtenerMesaDeUrl(searchParams: string): MesaInfo {
  return ParserMesaUrl.desdeSearchParams(searchParams).toDTO();
}
