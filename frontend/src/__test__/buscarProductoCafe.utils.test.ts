
import { describe, it, expect } from 'vitest';
import { buscarProductoCafe } from '../utils/buscarProductoCafe';
import type { Producto } from '../schemas/producto.schema';

describe('buscarProductoCafe', () => {
    it('devuelve el café que coincide con tipo, tamaño y variedad', () => {
        const productos: Producto[] = [
        {
            id: 1,
            nombre: 'Expreso Pocillo Brasil',
            tipo: 'CAFE_EXPRESO',
            tamano: 'POCILLO',
            gramos: 18,
            variedad: 'BRASIL',
            descripcionVariedad: 'Acidez baja, cuerpo denso',
            precioBase: 2500,
            precio: 5020,
        },
        {
            id: 2,
            nombre: 'Filtrado Mediano Colombia',
            tipo: 'CAFE_FILTRADO',
            tamano: 'MEDIANO',
            gramos: 15,
            variedad: 'COLOMBIA',
            descripcionVariedad: 'Acidez media, cuerpo equilibrado',
            precioBase: 3200,
            precio: 5300,
        },
        ];

        const resultado = buscarProductoCafe(
        productos,
        'CAFE_FILTRADO',
        'MEDIANO',
        'COLOMBIA'
        );

        expect(resultado?.id).toBe(2);
    });
});
