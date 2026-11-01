import type { Producto } from '../schemas/producto.schema';

type ItemCarrito = {
    producto: Producto;
    cantidad: number;
};

export function calcularTotalCarrito(items: ItemCarrito[]): number {
    return items.reduce(
        (total, item) => total + item.producto.precio * item.cantidad,
        0
    );
}

export function calcularCantidadTotal(items: ItemCarrito[]): number {
    return items.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}