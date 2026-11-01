
import { describe, it, expect } from 'vitest';
import { CrearPedidoSchema } from '../schemas/pedido.schema';

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
