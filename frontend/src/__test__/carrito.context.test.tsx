
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CarritoProvider, useCarrito } from '../carrito/carrito.context';

function ComponentePrueba() {
    const { estado } = useCarrito();

    return (
        <div data-testid="cantidad-productos">
        {estado.items.length}
        </div>
    );
}

describe('CarritoContext', () => {
    it('debe iniciar con el carrito vacío', () => {
        render(
        <CarritoProvider>
            <ComponentePrueba />
        </CarritoProvider>
        );

        expect(screen.getByTestId('cantidad-productos').textContent).toBe('0');
    });

    
    it('permite agregar un producto desde un componente usando dispatch', () => {
    function ComponentePrueba() {
        const { estado, dispatch } = useCarrito();

        return (
        <>
            <span data-testid="cantidad-productos">
            {estado.items.length}
            </span>

            <button
            onClick={() =>
                dispatch({
                type: 'AGREGAR_PRODUCTO',
                producto: {
                    id: 19,
                    nombre: 'Muffin de chocolate',
                    tipo: 'PASTELERIA',
                    precioBase: 2500,
                    precio: 2500
                }
                })
            }
            >
            Agregar producto
            </button>
        </>
        );
    }

    render(
        <CarritoProvider>
        <ComponentePrueba />
        </CarritoProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));

    expect(screen.getByTestId('cantidad-productos').textContent).toBe('1');
    });

});
