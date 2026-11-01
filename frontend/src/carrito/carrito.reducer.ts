
import type { Producto } from '../schemas/producto.schema';

type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

type EstadoCarrito = {
  items: ItemCarrito[];
};

type AccionCarrito = {
  type: 'AGREGAR_PRODUCTO';
  producto: Producto;
};

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito
): EstadoCarrito {
  switch (accion.type) {
    case 'AGREGAR_PRODUCTO':
      return {
        ...estado,
        items: [
          ...estado.items,
          {
            producto: accion.producto,
            cantidad: 1
          }
        ]
      };
  }
}
