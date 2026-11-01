
import { z } from 'zod';

export const ItemCrearPedidoSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive()
});

export const CrearPedidoSchema = z.object({
  mesaId: z.number().int().positive().optional(),
  items: z.array(ItemCrearPedidoSchema).min(1)
});

export type CrearPedido = z.infer<typeof CrearPedidoSchema>;
