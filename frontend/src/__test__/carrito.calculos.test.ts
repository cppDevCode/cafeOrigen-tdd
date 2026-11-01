import { describe, it, expect } from 'vitest';
import { calcularTotalCarrito, calcularCantidadTotal, calcularSubtotalItem } from '../carrito/carrito.calculos';
import type { Producto } from '../schemas/producto.schema';

describe('Cálculos del carrito', () => {
    it('debe calcular el total considerando el precio y la cantidad de cada producto', () => {
        const cafe: Producto = {
        id: 1,
        nombre: 'Café expreso',
        precioBase: 2000,
        precio: 2500,
        tipo: 'CAFE_EXPRESO',
        tamano: 'POCILLO',
        gramos: 18,
        variedad: 'BRASIL'
        };

        const medialuna: Producto = {
        id: 2,
        nombre: 'Medialuna',
        precioBase: 1200,
        precio: 1200,
        tipo: 'PASTELERIA'
        };

        const items = [
        { producto: cafe, cantidad: 2 },
        { producto: medialuna, cantidad: 3 }
        ];

        const total = calcularTotalCarrito(items);

        expect(total).toBe(8600);
    });

    it('debe calcular la cantidad total de unidades del carrito', () => {
    const items = [
        {
        producto: {
            id: 1,
            nombre: 'Café expreso',
            precioBase: 2000,
            precio: 2500,
            tipo: 'CAFE_EXPRESO' as const,
            tamano: 'POCILLO' as const,
            gramos: 18,
            variedad: 'BRASIL' as const
        },
        cantidad: 2
        },
        {
        producto: {
            id: 2,
            nombre: 'Medialuna',
            precioBase: 1200,
            precio: 1200,
            tipo: 'PASTELERIA' as const
        },
        cantidad: 3
        }
    ];

    expect(calcularCantidadTotal(items)).toBe(5);
    });

    it('debe devolver 0 como total cuando el carrito está vacío', () => {
    expect(calcularTotalCarrito([])).toBe(0);
    });

    it('debe devolver 0 unidades cuando el carrito está vacío', () => {
    expect(calcularCantidadTotal([])).toBe(0);
    });

    it('debe calcular el subtotal de un producto según su precio y cantidad', () => {
    const item = {
        producto: {
        id: 1,
        nombre: 'Café expreso',
        precioBase: 2000,
        precio: 2500,
        tipo: 'CAFE_EXPRESO' as const,
        tamano: 'POCILLO' as const,
        gramos: 18,
        variedad: 'BRASIL' as const
        },
        cantidad: 3
    };

    expect(calcularSubtotalItem(item)).toBe(7500);
});
});