
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


export const EstadoPedidoSchema = z.enum([
  'PENDIENTE',
  'EN_PREPARACION',
  'ENTREGADO'
]);

export const ItemPedidoSchema = z.object({
  id: z.number().int().positive(),
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().nonnegative()
});

export const PedidoSchema = z.object({
  id: z.number().int().positive(),
  estado: EstadoPedidoSchema,
  total: z.number().nonnegative(),
  items: z.array(ItemPedidoSchema).min(1)
});

export type Pedido = z.infer<typeof PedidoSchema>;
export type EstadoPedido = z.infer<typeof EstadoPedidoSchema>;
