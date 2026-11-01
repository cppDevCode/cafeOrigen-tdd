
import { z } from 'zod';

const ProductoBaseSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  precioBase: z.number().nonnegative(),
  precio: z.number().nonnegative()
});

const CafeSchema = ProductoBaseSchema.extend({
  tipo: z.enum(['CAFE_EXPRESO', 'CAFE_FILTRADO']),
  tamano: z.enum(['POCILLO', 'MEDIANO', 'TAZA_GRANDE']),
  gramos: z.number().positive(),
  variedad: z.enum(['BRASIL', 'COLOMBIA', 'ETIOPIA'])
});

const PasteleriaSchema = ProductoBaseSchema.extend({
  tipo: z.literal('PASTELERIA')
});

export const ProductoSchema = z.discriminatedUnion('tipo', [
  CafeSchema,
  PasteleriaSchema
]);

export const ProductosSchema = z.array(ProductoSchema);

export type Producto = z.infer<typeof ProductoSchema>;
