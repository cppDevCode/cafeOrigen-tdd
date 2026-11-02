
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
            </div>
        ))}
        </section>
    );
}
