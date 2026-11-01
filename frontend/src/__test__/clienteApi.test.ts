import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mswServer';
import { ClienteApi, ErrorApiHttp, ErrorContratoZod } from '../services/clienteApi';

describe('Clase ClienteApi', () => {
  const cliente = new ClienteApi('http://localhost:3001/api');

  it('devuelve la lista de productos tipada cuando cumple ProductoSchema', async () => {
    const productos = await cliente.obtenerProductos();
    expect(productos).toHaveLength(2);
    expect(productos[0]?.precio).toBe(5020);
  });

  it('lanza una instancia de ErrorApiHttp cuando la API responde HTTP 500', async () => {
    server.use(
      http.get('*/api/productos', () =>
        HttpResponse.json({ error: 'No se pudieron obtener los productos' }, { status: 500 })
      )
    );

    await expect(cliente.obtenerProductos()).rejects.toThrow(ErrorApiHttp);
    await expect(cliente.obtenerProductos()).rejects.toThrow('No se pudieron obtener los productos');
  });

  it('lanza una instancia de ErrorContratoZod cuando el payload viola ProductoSchema', async () => {
    server.use(
      http.get('*/api/productos', () =>
        HttpResponse.json([{ id: 1, nombre: 'Café roto', tipo: 'DESCONOCIDO', precio: 'gratis' }])
      )
    );

    await expect(cliente.obtenerProductos()).rejects.toThrow(ErrorContratoZod);
  });
});
