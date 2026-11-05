
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CarritoProvider, useCarrito } from '../carrito/carrito.context';
import { Carrito } from '../components/Carrito';
import type { Producto } from '../schemas/producto.schema';

const mocks = vi.hoisted(() => ({
  crearPedido: vi.fn(),
  obtenerPedido: vi.fn()
}));

vi.mock('../services/clienteApi', () => ({
  clienteApiPorDefecto: {
    crearPedido: mocks.crearPedido,
    obtenerPedido: mocks.obtenerPedido
  }
}));

const producto = {
  id: 1,
  nombre: 'Café Brasil',
  precioBase: 2500
} as Producto;

function PrepararCarrito() {
  const { dispatch } = useCarrito();

  return (
    <button
      type="button"
      onClick={() => {
        dispatch({
          type: 'AGREGAR_PRODUCTO',
          producto
        });
      }}
    >
      Agregar café
    </button>
  );
}

function renderizar() {
  return render(
    <CarritoProvider>
      <PrepararCarrito />
      <Carrito />
    </CarritoProvider>
  );
}

const pedidoCreado = {
  id: 15,
  estado: 'PENDIENTE',
  total: 2500,
  mesaId: 4,
  items: [
    {
      id: 1,
      productoId: 1,
      cantidad: 1,
      precioUnitario: 2500
    }
  ]
};

describe('Confirmación y seguimiento de pedidos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function agregarYConfirmar() {
    const usuario = userEvent.setup();

    await usuario.click(
      screen.getByRole('button', { name: 'Agregar café' })
    );

    await usuario.click(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    );

    return usuario;
  }

  it('envía los productos al confirmar el pedido', async () => {
    mocks.crearPedido.mockResolvedValue(pedidoCreado);

    renderizar();
    await agregarYConfirmar();

    await waitFor(() => {
      expect(mocks.crearPedido).toHaveBeenCalledWith({
        items: [{ productoId: 1, cantidad: 1 }]
      });
    });
  });

  it('muestra el ID, estado y total devueltos por la API', async () => {
    mocks.crearPedido.mockResolvedValue(pedidoCreado);

    renderizar();
    await agregarYConfirmar();

    expect(
      await screen.findByText(/Pedido #15/)
    ).toBeTruthy();

    expect(
      screen.getByText(/PENDIENTE/)
    ).toBeTruthy();

    expect(
      screen.getByText(/Total del pedido:.*2500/)
    ).toBeTruthy();
  });

  it('vacía el carrito después de confirmar correctamente', async () => {
    mocks.crearPedido.mockResolvedValue(pedidoCreado);

    renderizar();
    await agregarYConfirmar();

    expect(
      await screen.findByText('Tu carrito está vacío')
    ).toBeTruthy();
  });

  it('conserva los productos cuando falla la confirmación', async () => {
    mocks.crearPedido.mockRejectedValue(
      new Error('Error al crear pedido')
    );

    renderizar();
    await agregarYConfirmar();

    expect(
      await screen.findByText('Error al crear pedido')
    ).toBeTruthy();

    expect(
      screen.getByText('Café Brasil')
    ).toBeTruthy();
  });

  it('consulta y actualiza el estado sin recargar la página', async () => {
    mocks.crearPedido.mockResolvedValue(pedidoCreado);

    mocks.obtenerPedido.mockResolvedValue({
      ...pedidoCreado,
      estado: 'EN_PREPARACION'
    });

    renderizar();
    const usuario = await agregarYConfirmar();

    const botonActualizar = await screen.findByRole('button', {
      name: 'Actualizar estado'
    });

    await usuario.click(botonActualizar);

    await waitFor(() => {
      expect(mocks.obtenerPedido).toHaveBeenCalledWith(15);
    });

    expect(
      await screen.findByText(/EN_PREPARACION/)
    ).toBeTruthy();
  });
});
