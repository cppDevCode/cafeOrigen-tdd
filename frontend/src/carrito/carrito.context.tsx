
import { createContext, useContext, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react';

import { carritoReducer } from './carrito.reducer';
import type { EstadoCarrito } from './carrito.types';

type ContextoCarrito = {
    estado: EstadoCarrito;
    dispatch: Dispatch<Parameters<typeof carritoReducer>[1]>;
};

const CarritoContext = createContext<ContextoCarrito | undefined>(
    undefined
);

export function CarritoProvider({
    children}: {
        children: ReactNode;
    }) {
    const [estado, dispatch] = useReducer(carritoReducer, {
        items: []
    });

    return (
        <CarritoContext.Provider value={{ estado, dispatch }}>
        {children}
        </CarritoContext.Provider>
    );
}

export function useCarrito() {
    const contexto = useContext(CarritoContext);

    if (!contexto) {
        throw new Error(
        'useCarrito debe utilizarse dentro de CarritoProvider'
        );
    }

    return contexto;
}
