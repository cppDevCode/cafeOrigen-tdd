import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { SelectorCafe } from './SelectorCafe';
import '@testing-library/jest-dom/vitest';
import { useState, useEffect } from 'react';

const mockProductos = [
  {
    id: 1, nombre: 'Expreso Mediano Colombia', tipo: 'CAFE_EXPRESO',
    precioBase: 6000, precio: 7360, tamano: 'MEDIANO', gramos: 27, 
    variedad: 'COLOMBIA', descripcionVariedad: 'Acidez media, notas cítricas.'
  }
];

const server = setupServer(
  http.get('http://localhost:3000/productos', () => {
    return HttpResponse.json(mockProductos);
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());


function CatalogoWrapper() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);

  
    useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);


  return (
    <div>
      <div data-testid="carrito-count">Items en carrito: {carrito.length}</div>
      <SelectorCafe productos={productos} onAgregar={(prod) => setCarrito([...carrito, prod])} />
    </div>
  );
}

describe('Integración: Catálogo y Carrito', () => {
  it('flujo completo: carga productos de la API (MSW), selecciona un café y lo agrega al carrito', async () => {
    render(<CatalogoWrapper />);

    // 1. Esperamos a que MSW responda y se renderice el componente
    await waitFor(() => {
      expect(screen.getByText(/Armá tu Café/i)).toBeInTheDocument();
    });

    // 2. Simulamos la selección del usuario (3 pasos)
    fireEvent.click(screen.getByLabelText(/expreso/i));
    fireEvent.click(screen.getByLabelText(/mediano/i));
    fireEvent.click(screen.getByLabelText(/colombia/i));

    // 3. Hacemos clic en Agregar al carrito
    const btnAgregar = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(btnAgregar);

    // 4. Verificamos que el carrito se actualizó
    expect(screen.getByTestId('carrito-count')).toHaveTextContent('Items en carrito: 1');
  });
});