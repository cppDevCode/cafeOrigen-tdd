
import { describe, it, expect } from 'vitest';
import { ProductoSchema } from '../schemas/producto.schema.ts';

describe('ProductoSchema', () => {
  it('acepta un producto de pastelería válido', () => {
    const producto = {
      id: 19,
      nombre: 'Muffin de chocolate',
      tipo: 'PASTELERIA',
      precioBase: 2500,
      precio: 2500
    };

    const resultado = ProductoSchema.safeParse(producto);

    expect(resultado.success).toBe(true);
  });
});
