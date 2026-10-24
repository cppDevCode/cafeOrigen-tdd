import { describe, it, expect } from 'vitest';
import type { IProducto } from '../interfaces/producto.interface.js';
import { Pasteleria } from '../model/pasteleria.model.js';

const casos: [string, IProducto, number][] = [
    ['Muffin de chocolate',          new Pasteleria(19, 'Muffin de chocolate', 2500),          2500],
    ['Porción de torta selva negra', new Pasteleria(20, 'Porción de torta selva negra', 4200), 4200],
    ];

    describe('Producto - calcularPrecio()', () => {
    it.each(casos)('%s devuelve el precio final de la tabla', (_nombre, producto, esperado) => {
        expect(producto.calcularPrecio()).toBe(esperado);
    });
    });