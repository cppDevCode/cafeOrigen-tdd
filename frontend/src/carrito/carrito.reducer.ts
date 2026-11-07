
import type { Producto } from '../schemas/producto.schema';
import type { EstadoCarrito } from './carrito.types';


type AccionCarrito =
    | {
        type: 'AGREGAR_PRODUCTO';
        producto: Producto;
        }
    | {
        type: 'DISMINUIR_CANTIDAD';
        productoId: number;
        }
    | {
        type: 'ELIMINAR_PRODUCTO';
        productoId: number;
        }
        
    | {
        type: 'VACIAR_CARRITO';
    };;


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

    
    case 'ELIMINAR_PRODUCTO': {
    return {
        ...estado,
        items: estado.items.filter(
        item => item.producto.id !== accion.productoId
        )
    };
    }

    
    case 'VACIAR_CARRITO': {
    return {
        ...estado,
        items: []
    };
}

  }
}
