
import type { Producto } from '../schemas/producto.schema';

type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

type EstadoCarrito = {
  items: ItemCarrito[];
};

type AccionCarrito =
  | {
      type: 'AGREGAR_PRODUCTO';
      producto: Producto;
    }
  | {
      type: 'DISMINUIR_CANTIDAD';
      productoId: number;
    };

export function carritoReducer(
  estado: EstadoCarrito,
  accion: AccionCarrito
): EstadoCarrito {
  switch (accion.type) {
    case 'AGREGAR_PRODUCTO': {
      const productoExistente = estado.items.some(
        item => item.producto.id === accion.producto.id
      );

      if (productoExistente) {
        return {
          ...estado,
          items: estado.items.map(item =>
            item.producto.id === accion.producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        };
      }

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

    
    case 'DISMINUIR_CANTIDAD': {
    return {
        ...estado,
        items: estado.items
        .map(item =>
            item.producto.id === accion.productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    };
    }

  }
}
