import type { Producto } from '../schemas/producto.schema';

export type ItemCarrito = {
    producto: Producto;
    cantidad: number;
};

export type EstadoCarrito = {
    items: ItemCarrito[];
};