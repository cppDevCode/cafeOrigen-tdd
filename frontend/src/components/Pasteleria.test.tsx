import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pasteleria } from './Pasteleria';
import '@testing-library/jest-dom/vitest';
import type { Producto } from '../schemas/producto.schema'; 

const pasteleriaFalsa = [
  { id: 10, nombre: 'Muffin de chocolate', tipo: 'PASTELERIA', precioBase: 3500, precio: 3500 },
  { id: 11, nombre: 'Porción Selva Negra', tipo: 'PASTELERIA', precioBase: 4500, precio: 4500 }
] as Producto[];

describe('Componente Pasteleria', () => {
  it('muestra los productos y permite agregarlos al carrito', () => {
    const handleAgregar = vi.fn();
    render(<Pasteleria productos={pasteleriaFalsa} onAgregar={handleAgregar} />);

    
    expect(screen.getByText('Muffin de chocolate')).toBeInTheDocument();
    
      
    expect(screen.getByText('$ 3.500,00')).toBeInTheDocument();

    
    const botonMuffin = screen.getByRole('button', { name: /agregar muffin de chocolate/i });
    fireEvent.click(botonMuffin);

    
    expect(handleAgregar).toHaveBeenCalledWith(pasteleriaFalsa[0]);
  });
});