import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mswServer';
import { ClienteApi } from '../services/clienteApi';
import { AppMenuHeader } from '../components/AppMenuHeader';
import { MenuContainer } from '../components/MenuContainer';

describe('Integracion: AppMenuHeader y MenuContainer con ClienteApi inyectado', () => {
  it('renderiza polimorficamente "Mesa 4" con ?mesa=4 y "Retiro en barra" sin parámetro', () => {
    const { rerender } = render(<AppMenuHeader searchParams="?mesa=4" />);
    expect(screen.getByTestId('modalidad-atencion')).toHaveTextContent('Mesa 4');

    rerender(<AppMenuHeader searchParams="" />);
    expect(screen.getByTestId('modalidad-atencion')).toHaveTextContent('Retiro en barra');
  });

  it('carga los productos a traves de la instancia inyectada de ClienteApi y muestra Armá tu café + Pastelería', async () => {
    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} />);

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i);
    expect(await screen.findByText(/Muffin de chocolate/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /armá tu café/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pastelería/i })).toBeInTheDocument();
  });

  it('permite seleccionar bebida, tamaño y origen en el configurador e invocar onAgregarProducto', async () => {
    server.use(
      http.get('*/api/productos', () =>
        HttpResponse.json([
          {
            id: 1,
            nombre: 'Expreso Pocillo Brasil',
            tipo: 'CAFE_EXPRESO',
            precioBase: 2500,
            tamano: 'POCILLO',
            gramos: 18,
            variedad: 'BRASIL',
            descripcionVariedad: 'Acidez baja, cuerpo denso',
            precio: 5020,
          },
          {
            id: 14,
            nombre: 'Filtrado Mediano Colombia',
            tipo: 'CAFE_FILTRADO',
            precioBase: 3200,
            tamano: 'MEDIANO',
            gramos: 15,
            variedad: 'COLOMBIA',
            descripcionVariedad: 'Acidez media, cuerpo equilibrado',
            precio: 5300,
          },
        ])
      )
    );

    const onAgregar = vi.fn();
    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} onAgregarProducto={onAgregar} />);

    await screen.findByRole('heading', { name: /armá tu café/i });

    await userEvent.click(screen.getByLabelText(/Filtrado/i));
    await userEvent.click(screen.getByLabelText(/Mediano/i));
    await userEvent.click(screen.getByLabelText(/Colombia/i));

    await userEvent.click(
      screen.getByRole('button', { name: /agregar al carrito/i })
    );

    expect(onAgregar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 14,
        nombre: 'Filtrado Mediano Colombia',
      })
    );
  });

  it('ante un error 500 muestra alerta y permite reintentar invocando al objeto servicio', async () => {
    server.use(
      http.get(
        '*/api/productos',
        () => HttpResponse.json({ error: 'Error interno del servidor' }, { status: 500 }),
        { once: true }
      )
    );

    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Error interno del servidor/i);
    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText(/Muffin de chocolate/i)).toBeInTheDocument();
  });

  it('ante una API caída muestra alerta de error de red y permite reintentar', async () => {
    server.use(
      http.get('*/api/productos', () => HttpResponse.error(), { once: true })
    );

    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/No se pudo conectar con el servidor/i);
    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(await screen.findByText(/Muffin de chocolate/i)).toBeInTheDocument();
  });

  it('ante una respuesta que no cumple el contrato Zod muestra alerta de error', async () => {
    server.use(
      http.get('*/api/productos', () =>
        HttpResponse.json([{ id: 1, nombre: 'Invalido', tipo: 'OTRO', precio: 'mal' }])
      )
    );

    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/Contrato de datos inválido/i);
  });
});
