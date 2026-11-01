
import { describe, it, expect } from 'vitest';
import { CrearPedidoSchema, PedidoSchema } from '../schemas/pedido.schema.ts';

describe('CrearPedidoSchema', () => {
  it('acepta un pedido para retiro en barra sin mesaId', () => {
    const pedido = {
      items: [
        { productoId: 1, cantidad: 2 }
      ]
    };

    const resultado = CrearPedidoSchema.safeParse(pedido);

    expect(resultado.success).toBe(true);
  });

  it('acepta un pedido asociado a una mesa', () => {
    const pedido = {
      mesaId: 4,
      items: [
        { productoId: 1, cantidad: 2 }
      ]
    };

    const resultado = CrearPedidoSchema.safeParse(pedido);

    expect(resultado.success).toBe(true);
  });
});


describe('PedidoSchema', () => {
  it('acepta la respuesta de un pedido válido', () => {
    const pedido = {
      id: 15,
      estado: 'PENDIENTE',
      total: 10040,
      items: [
        {
          id: 1,
          productoId: 1,
          cantidad: 2,
          precioUnitario: 5020
        }
      ]
    };

    const resultado = PedidoSchema.safeParse(pedido);

    expect(resultado.success).toBe(true);
  });

  it('rechaza un pedido con un estado desconocido', () => {
    const pedido = {
      id: 15,
      estado: 'CANCELADO',
      total: 10040,
      items: [
        {
          id: 1,
          productoId: 1,
          cantidad: 2,
          precioUnitario: 5020
        }
      ]
    };

    const resultado = PedidoSchema.safeParse(pedido);

    expect(resultado.success).toBe(false);
  });
});

