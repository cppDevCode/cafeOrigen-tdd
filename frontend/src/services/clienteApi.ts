import { ProductosSchema, type Producto } from '../schemas/producto.schema';
import { ErrorApiSchema } from '../schemas/error.schema';
import { PedidoSchema, type Pedido, type CrearPedido } from '../schemas/pedido.schema';

export interface ICatalogoCliente {
  obtenerProductos(): Promise<Producto[]>;
}

export class ErrorApiHttp extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ErrorApiHttp';
  }
}

export class ErrorContratoZod extends Error {
  constructor(message = 'Contrato de datos inválido al recibir productos') {
    super(message);
    this.name = 'ErrorContratoZod';
  }
}

export class ClienteApi implements ICatalogoCliente {
  constructor(
    private readonly baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
  ) {}

  public async obtenerProductos(): Promise<Producto[]> {
    const response = await fetch(`${this.baseUrl}/productos`);

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    const data: unknown = await response.json();
    return this.validarContratoProductos(data);
  }

  private async construirErrorHttp(response: Response): Promise<ErrorApiHttp> {
    const body: unknown = await response.json().catch(() => null);
    const parsedError = ErrorApiSchema.safeParse(body);
    const mensaje = parsedError.success
      ? parsedError.data.error
      : `Error HTTP ${response.status}`;

    return new ErrorApiHttp(response.status, mensaje);
  }

  private validarContratoProductos(data: unknown): Producto[] {
    const validacion = ProductosSchema.safeParse(data);
    if (!validacion.success) {
      throw new ErrorContratoZod();
    }
    return validacion.data;
  }

  public async crearPedido(datos: CrearPedido): Promise<Pedido> {
  const response = await fetch(`${this.baseUrl}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    throw await this.construirErrorHttp(response);
  }

  return PedidoSchema.parse(await response.json());
  }

  public async obtenerPedido(id: number): Promise<Pedido> {
    const response = await fetch(`${this.baseUrl}/pedidos/${id}`);

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    return PedidoSchema.parse(await response.json());
  }
}

// Instancia por defecto y método exportado para compatibilidad
export const clienteApiPorDefecto = new ClienteApi();
export const obtenerProductos = () => clienteApiPorDefecto.obtenerProductos();
