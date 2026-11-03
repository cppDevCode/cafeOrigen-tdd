
import { useState } from 'react';
import { useCarrito } from '../carrito/carrito.context';
import { calcularSubtotalItem, calcularTotalCarrito } from '../carrito/carrito.calculos';
import { clienteApiPorDefecto } from '../services/clienteApi';
import type { Pedido } from '../schemas/pedido.schema';

type CarritoProps = {
    mesaId?: number;
};

export function Carrito({ mesaId }: CarritoProps) {
    const { estado, dispatch } = useCarrito();

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function confirmarPedido() {
        if (estado.items.length === 0 || cargando) return;

        setCargando(true);
        setError(null);

        try {
        const datos = {
            ...(mesaId !== undefined ? { mesaId } : {}),
            items: estado.items.map((item) => ({
            productoId: item.producto.id,
            cantidad: item.cantidad
            }))
        };

        const resultado = await clienteApiPorDefecto.crearPedido(datos);

        setPedido(resultado);
        dispatch({ type: 'VACIAR_CARRITO' });
        } catch (errorDesconocido) {
        setError(
            errorDesconocido instanceof Error
            ? errorDesconocido.message
            : 'No se pudo confirmar el pedido'
        );
        } finally {
        setCargando(false);
        }
    }

    async function actualizarEstado() {
        if (!pedido || cargando) return;

        setCargando(true);
        setError(null);

        try {
        const actualizado =
            await clienteApiPorDefecto.obtenerPedido(pedido.id);

        setPedido(actualizado);
        } catch (errorDesconocido) {
        setError(
            errorDesconocido instanceof Error
            ? errorDesconocido.message
            : 'No se pudo actualizar el pedido'
        );
        } finally {
        setCargando(false);
        }
    }

    return (
        <section aria-label="Carrito">
        {pedido && (
            <section aria-label="Seguimiento del pedido">
            <h2>Pedido #{pedido.id}</h2>
            <p>Estado: {pedido.estado}</p>
            <p>Total del pedido: ${pedido.total}</p>

            <button
                type="button"
                onClick={actualizarEstado}
                disabled={cargando}
            >
                Actualizar estado
            </button>
            </section>
        )}

        {error && <p role="alert">{error}</p>}

        {estado.items.length === 0 ? (
            <>
            <p>Tu carrito está vacío</p>
            <button type="button" disabled>
                Confirmar pedido
            </button>
            </>
        ) : (
            <>
            {estado.items.map((item) => (
                <div key={item.producto.id}>
                <p>{item.producto.nombre}</p>
                <p>Cantidad: {item.cantidad}</p>
                <p>
                    Subtotal: ${calcularSubtotalItem(item)}
                </p>

                <button
                    type="button"
                    aria-label="Incrementar cantidad"
                    disabled={cargando}
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
                    disabled={cargando}
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
                    disabled={cargando}
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

            <p>Total: ${calcularTotalCarrito(estado.items)}</p>

            <button
                type="button"
                onClick={confirmarPedido}
                disabled={cargando}
            >
                {cargando ? 'Procesando...' : 'Confirmar pedido'}
            </button>
            </>
        )}
        </section>
    );
}
