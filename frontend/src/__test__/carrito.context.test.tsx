
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
