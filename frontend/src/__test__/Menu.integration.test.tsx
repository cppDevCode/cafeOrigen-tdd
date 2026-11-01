import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
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

  it('carga los productos a traves de la instancia inyectada de ClienteApi', async () => {
    const servicio = new ClienteApi('http://localhost:3001/api');
    render(<MenuContainer servicioCatalogo={servicio} />);

    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i);
    expect(await screen.findByText(/Muffin de chocolate/i)).toBeInTheDocument();
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
});
