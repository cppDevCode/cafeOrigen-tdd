
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CarritoProvider } from '../carrito/carrito.context';
import { Carrito } from '../components/Carrito';
import { useCarrito } from '../carrito/carrito.context'; 

describe('Carrito', () => {
    it('muestra un mensaje cuando el carrito está vacío', () => {
        render(
        <CarritoProvider>
            <Carrito />
        </CarritoProvider>
        );

        expect(
        screen.getByText('Tu carrito está vacío')
        ).toBeInTheDocument();
    });

    
    it('muestra el nombre y la cantidad de los productos agregados', () => {
    function AgregarProducto() {
        const { dispatch } = useCarrito();

        return (
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
        );
    }

    render(
        <CarritoProvider>
        <AgregarProducto />
        <Carrito />
        </CarritoProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar producto' }));

    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
    });

});
