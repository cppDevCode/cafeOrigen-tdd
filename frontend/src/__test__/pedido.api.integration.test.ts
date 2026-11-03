
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mswServer';
import { ClienteApi } from '../services/clienteApi';

describe('Integración HTTP de pedidos con MSW', () => {
    const api = new ClienteApi('http://localhost:3002/api');

    const pedidoEjemplo = {
        id: 15,
        estado: 'PENDIENTE',
        total: 5000,
        items: [
        {
            id: 1,
            productoId: 1,
            cantidad: 2,
            precioUnitario: 2500
        }
        ]
    };

    it('envía el pedido mediante POST y recibe la confirmación', async () => {
        let cuerpoRecibido: unknown;

        server.use(
        http.post('*/api/pedidos', async ({ request }) => {
            cuerpoRecibido = await request.json();

            return HttpResponse.json(pedidoEjemplo, {
            status: 201
            });
        })
        );

        const resultado = await api.crearPedido({
        mesaId: 4,
        items: [{ productoId: 1, cantidad: 2 }]
        });

        expect(cuerpoRecibido).toEqual({
        mesaId: 4,
        items: [{ productoId: 1, cantidad: 2 }]
        });

        expect(resultado.id).toBe(15);
        expect(resultado.estado).toBe('PENDIENTE');
        expect(resultado.total).toBe(5000);
    });

    it('consulta el estado actualizado mediante GET', async () => {
        let idConsultado: string | undefined;

        server.use(
        http.get('*/api/pedidos/:id', ({ params }) => {
            idConsultado = String(params.id);

            return HttpResponse.json({
            ...pedidoEjemplo,
            estado: 'EN_PREPARACION'
            });
        })
        );

        const resultado = await api.obtenerPedido(15);

        expect(idConsultado).toBe('15');
        expect(resultado.estado).toBe('EN_PREPARACION');
    });

    it('informa un error cuando falla la creación del pedido', async () => {
        server.use(
        http.post('*/api/pedidos', () =>
            HttpResponse.json(
            {
                codigo: 'ERROR_INTERNO',
                mensaje: 'No se pudo crear el pedido'
            },
            { status: 500 }
            )
        )
        );

        await expect(
        api.crearPedido({
            items: [{ productoId: 1, cantidad: 2 }]
        })
        ).rejects.toThrow();
    });

    it('rechaza una respuesta que incumple el contrato del pedido', async () => {
        server.use(
        http.post('*/api/pedidos', () =>
            HttpResponse.json({
            id: 'incorrecto',
            estado: 'DESCONOCIDO'
            })
        )
        );

        await expect(
        api.crearPedido({
            items: [{ productoId: 1, cantidad: 2 }]
        })
        ).rejects.toThrow();
    });
});
