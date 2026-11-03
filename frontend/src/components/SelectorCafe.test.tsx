import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SelectorCafe } from './SelectorCafe';
import '@testing-library/jest-dom/vitest';
import type { Producto } from '../schemas/producto.schema';

const catalogoFalso = [
  {
    id: 1, nombre: 'Expreso Mediano Colombia', tipo: 'CAFE_EXPRESO',
    precioBase: 6000, precio: 7360, tamano: 'MEDIANO', gramos: 27, 
    variedad: 'COLOMBIA', descripcionVariedad: 'Acidez media, cuerpo equilibrado y notas cítricas.'
  },
  {
    id: 2, nombre: 'Expreso Mediano Etiopía', tipo: 'CAFE_EXPRESO',
    precioBase: 6000, precio: 7360, tamano: 'MEDIANO', gramos: 27, 
    variedad: 'ETIOPIA', descripcionVariedad: 'Acidez muy viva, cuerpo ligero y notas frutales.'
  }
] as Producto[];

describe('Componente SelectorCafe', () => {
  it('el boton arranca deshabilitado y se habilita al elegir los 3 pasos', () => {
    const handleAgregar = vi.fn();
    render(<SelectorCafe productos={catalogoFalso} onAgregar={handleAgregar} />);

    const btnAgregar = screen.getByRole('button', { name: /agregar al carrito/i });
    
    
    expect(btnAgregar).toBeDisabled();

    
    fireEvent.click(screen.getByLabelText(/expreso/i));
    fireEvent.click(screen.getByLabelText(/mediano/i));
    fireEvent.click(screen.getByLabelText(/colombia/i));

    
    expect(screen.getByText(/acidez media, cuerpo equilibrado/i)).toBeInTheDocument();

   
    expect(btnAgregar).toBeEnabled();
    expect(screen.getByText('$ 7.360,00')).toBeInTheDocument(); 
    
   
    fireEvent.click(btnAgregar);
    expect(handleAgregar).toHaveBeenCalledWith(catalogoFalso[0]);
  });
});