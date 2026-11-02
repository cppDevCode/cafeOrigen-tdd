
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarritoProvider } from '../carrito/carrito.context';
import { Carrito } from '../components/Carrito';

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
});
