import type { ItemCarrito } from './carrito.types';

export function calcularTotalCarrito(items: ItemCarrito[]): number {
    return items.reduce(
        (total, item) => total + calcularSubtotalItem(item),
        0
    );
}

export function calcularCantidadTotal(items: ItemCarrito[]): number {
    return items.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}

export function calcularSubtotalItem(item: ItemCarrito): number {
  return item.producto.precio * item.cantidad;
}