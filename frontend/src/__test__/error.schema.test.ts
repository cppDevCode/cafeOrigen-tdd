
import { describe, it, expect } from 'vitest';
import { ErrorApiSchema } from '../schemas/error.schema';

describe('ErrorApiSchema', () => {
  it('acepta una respuesta de error válida', () => {
    const respuesta = {
      error: 'Producto no encontrado'
    };

    const resultado = ErrorApiSchema.safeParse(respuesta);

    expect(resultado.success).toBe(true);
  });

  it('rechaza una respuesta sin el campo error', () => {
    const respuesta = {
      mensaje: 'Producto no encontrado'
    };

    const resultado = ErrorApiSchema.safeParse(respuesta);

    expect(resultado.success).toBe(false);
  });

  it('rechaza un mensaje de error vacío', () => {
    const respuesta = {
      error: ''
    };

    const resultado = ErrorApiSchema.safeParse(respuesta);

    expect(resultado.success).toBe(false);
  });
});
