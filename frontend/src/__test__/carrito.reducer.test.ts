
import { describe, it, expect } from 'vitest';
import { carritoReducer } from '../carrito/carrito.reducer';
import type { Producto } from '../schemas/producto.schema';

describe('carritoReducer', () => {
  it('agrega un producto a un carrito vacío', () => {
    const muffin: Producto = {
      id: 19,
      nombre: 'Muffin de chocolate',
      tipo: 'PASTELERIA',
      precioBase: 2500,
      precio: 2500
    };

    const estadoInicial = { items: [] };

    const nuevoEstado = carritoReducer(estadoInicial, {
      type: 'AGREGAR_PRODUCTO',
      producto: muffin
    });

    expect(nuevoEstado.items).toHaveLength(1);
    expect(nuevoEstado.items[0].producto.id).toBe(19);
    expect(nuevoEstado.items[0].cantidad).toBe(1);
  });

  
    it('incrementa la cantidad si el producto ya está en el carrito', () => {
    const muffin: Producto = {
        id: 19,
        nombre: 'Muffin de chocolate',
        tipo: 'PASTELERIA',
        precioBase: 2500,
        precio: 2500
    };

    const estadoInicial = {
        items: [{ producto: muffin, cantidad: 1 }]
    };

    const nuevoEstado = carritoReducer(estadoInicial, {
        type: 'AGREGAR_PRODUCTO',
        producto: muffin
    });

    expect(nuevoEstado.items).toHaveLength(1);
    expect(nuevoEstado.items[0].cantidad).toBe(2);
});


    it('disminuye la cantidad de un producto del carrito', () => {
    const muffin: Producto = {
        id: 19,
        nombre: 'Muffin de chocolate',
        tipo: 'PASTELERIA',
        precioBase: 2500,
        precio: 2500
    };

    const estadoInicial = {
        items: [{ producto: muffin, cantidad: 3 }]
    };

    const nuevoEstado = carritoReducer(estadoInicial, {
        type: 'DISMINUIR_CANTIDAD',
        productoId: 19
    });

    expect(nuevoEstado.items).toHaveLength(1);
    expect(nuevoEstado.items[0].cantidad).toBe(2);
    });

    
    it('elimina el producto cuando se disminuye su última unidad', () => {
    const muffin: Producto = {
        id: 19,
        nombre: 'Muffin de chocolate',
        tipo: 'PASTELERIA',
        precioBase: 2500,
        precio: 2500
    };

    const estadoInicial = {
        items: [{ producto: muffin, cantidad: 1 }]
    };

    const nuevoEstado = carritoReducer(estadoInicial, {
        type: 'DISMINUIR_CANTIDAD',
        productoId: 19
    });

    expect(nuevoEstado.items).toHaveLength(0);
    });


    });
