import { ProductoSchema, ProductosSchema, type Producto } from '../schemas/producto.schema';
import { ErrorApiSchema } from '../schemas/error.schema';
import { PedidoSchema, type Pedido, type CrearPedido } from '../schemas/pedido.schema';

export interface ICatalogoCliente {
  obtenerProductos(): Promise<Producto[]>;
  obtenerProductoPorId?(id: number): Promise<Producto>;
}

export abstract class ErrorClienteApi extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ErrorRedApi extends ErrorClienteApi {
  constructor(message = 'No se pudo conectar con el servidor') {
    super(message);
  }
}

export class ErrorApiHttp extends ErrorClienteApi {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export class ErrorContratoZod extends ErrorClienteApi {
  constructor(message = 'Contrato de datos inválido al recibir productos') {
    super(message);
  }
}

export class ClienteApi implements ICatalogoCliente {
  constructor(
    private readonly baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
  ) {}

  public async obtenerProductos(): Promise<Producto[]> {
    const response = await this.realizarPeticion('/productos');

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    const data: unknown = await response.json();
    return this.validarContratoProductos(data);
  }

  public async obtenerProductoPorId(id: number): Promise<Producto> {
    const response = await this.realizarPeticion(`/productos/${id}`);

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    const data: unknown = await response.json();
    const validacion = ProductoSchema.safeParse(data);
    if (!validacion.success) {
      throw new ErrorContratoZod('Contrato de datos inválido al recibir el producto');
    }
    return validacion.data;
  }

  public async crearPedido(datos: CrearPedido): Promise<Pedido> {
    const response = await this.realizarPeticion('/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    return PedidoSchema.parse(await response.json());
  }

  public async obtenerPedido(id: number): Promise<Pedido> {
    const response = await this.realizarPeticion(`/pedidos/${id}`);

    if (!response.ok) {
      throw await this.construirErrorHttp(response);
    }

    return PedidoSchema.parse(await response.json());
  }

  private async realizarPeticion(endpoint: string, init?: RequestInit): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, init);
    } catch {
      throw new ErrorRedApi();
    }
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
}

// Instancia por defecto y método exportado para compatibilidad
export const clienteApiPorDefecto = new ClienteApi();
export const obtenerProductos = () => clienteApiPorDefecto.obtenerProductos();
