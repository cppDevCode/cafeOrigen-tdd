import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { sequelize } from '../config/BaseDeDatos.js';
import { createTestingRouter } from '../routes/testing.route.js';
import { PedidoModel } from '../model/pedido.model.js';

const app = express();
app.use(express.json());
app.use('/__test__', createTestingRouter());

describe('Endpoints de Testing (Integración real con DB)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /__test__/reset', () => {
    it('debe vaciar la tabla de pedidos', async () => {
      // Insertamos un pedido falso
      await PedidoModel.create({ estado: 'PENDIENTE', total: 5000 });
      expect(await PedidoModel.count()).toBe(1);

      // Llamamos al reset
      const res = await request(app).post('/__test__/reset');

      expect(res.status).toBe(200);
      expect(await PedidoModel.count()).toBe(0);
    });
  });

  describe('POST /__test__/seed', () => {
    it('debe cargar los productos iniciales', async () => {
      const res = await request(app).post('/__test__/seed');
      expect(res.status).toBe(200);
    });
  });
});