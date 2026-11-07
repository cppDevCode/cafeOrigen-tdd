
import { describe, it, expect } from 'vitest';
import { formatearMoneda } from '../utils/moneda.utils';

describe('formatearMoneda', () => {
    it('formatea un precio entero en pesos argentinos', () => {
        expect(formatearMoneda(5020)).toBe('$ 5.020,00');
    });

    it('formatea un precio con decimales', () => {
        expect(formatearMoneda(2500.5)).toBe('$ 2.500,50');
    });

    it('formatea correctamente el valor cero', () => {
        expect(formatearMoneda(0)).toBe('$ 0,00');
    });
});
