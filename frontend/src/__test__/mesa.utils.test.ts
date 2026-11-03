import { describe, it, expect } from 'vitest';
import { AtencionEnMesa, RetiroEnBarra, ParserMesaUrl, obtenerMesaDeUrl } from '../utils/mesa.utils';

describe('Dominio POO: ModalidadAtencion y ParserMesaUrl', () => {
  it('instancia polimórficamente AtencionEnMesa cuando ?mesa=4 es válido', () => {
    const modalidad = ParserMesaUrl.desdeSearchParams('?mesa=4');

    expect(modalidad).toBeInstanceOf(AtencionEnMesa);
    expect(modalidad.esMesa()).toBe(true);
    expect(modalidad.obtenerMesaId()).toBe(4);
    expect(modalidad.toDTO()).toEqual({
      tipo: 'mesa',
      numero: 4,
      etiqueta: 'Mesa 4',
    });
  });

  it.each([
    '',
    '?ejemplo=ejemplo',
    '?mesa=',
    '?mesa=0',
    '?mesa=-5',
    '?mesa=abc',
    '?mesa=2.5',
    '?mesa=999999999999999999999',
  ])(
    'instancia RetiroEnBarra (Null Object) cuando searchParam es "%s"',
    (search) => {
      const modalidad = ParserMesaUrl.desdeSearchParams(search);

      expect(modalidad).toBeInstanceOf(RetiroEnBarra);
      expect(modalidad.esMesa()).toBe(false);
      expect(modalidad.obtenerMesaId()).toBeUndefined();
      expect(obtenerMesaDeUrl(search)).toEqual({
        tipo: 'barra',
        numero: null,
        etiqueta: 'Retiro en barra',
      });
    }
  );
});
