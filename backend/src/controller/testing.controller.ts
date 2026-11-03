import type { Request, Response } from 'express';
import { sequelize } from '../config/BaseDeDatos.js';

export class TestingController {
  public reset = async (req: Request, res: Response): Promise<Response> => {
    try {
      await sequelize.query('TRUNCATE TABLE pedido_items, pedidos, productos RESTART IDENTITY CASCADE;');
      return res.status(200).json({ message: 'Base de datos reiniciada' });
    } catch (error) {
      console.error('Error en reset:', error);
      return res.status(500).json({ error: 'Error al reiniciar la base de datos' });
    }
  };

  public seed = async (req: Request, res: Response): Promise<Response> => {
    try {
      await sequelize.query('TRUNCATE TABLE pedido_items, pedidos, productos RESTART IDENTITY CASCADE;');
      // El SQL del seed que te pasé antes...
      await sequelize.query(`
        INSERT INTO productos (nombre, tipo, precio_base, tamano, gramos, variedad) VALUES 
        ('Expreso Mediano Colombia', 'CAFE_EXPRESO', 6000, 'MEDIANO', 27, 'COLOMBIA'),
        ('Muffin de chocolate', 'PASTELERIA', 3500, NULL, NULL, NULL);
      `);
      return res.status(200).json({ message: 'Datos iniciales cargados' });
        } catch (error) {
      console.error('Error en seed:', error);
      return res.status(500).json({ error: 'Error al cargar los datos' });
    }
  };
}