
import { useCarrito } from '../carrito/carrito.context';

export function Carrito() {
    const { estado, dispatch } = useCarrito();

    if (estado.items.length === 0) {
        return <p>Tu carrito está vacío</p>;
    }

    return (
        <section>
        {estado.items.map(item => (
            <div key={item.producto.id}>
            <p>{item.producto.nombre}</p>
            <p>Cantidad: {item.cantidad}</p>

            <button
                type="button"
                aria-label="Incrementar cantidad"
                onClick={() =>
                dispatch({
                    type: 'AGREGAR_PRODUCTO',
                    producto: item.producto
                })
                }
            >
                +
            </button>

            <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={() =>
                dispatch({
                    type: 'DISMINUIR_CANTIDAD',
                    productoId: item.producto.id
                })
                }
            >
                −
            </button>

            <button
                type="button"
                aria-label="Eliminar producto"
                onClick={() =>
                dispatch({
                    type: 'ELIMINAR_PRODUCTO',
                    productoId: item.producto.id
                })
                }
            >
                Eliminar
            </button>
            </div>
        ))}
        </section>
    );
}
