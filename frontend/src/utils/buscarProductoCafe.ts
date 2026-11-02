
import type { Producto } from '../schemas/producto.schema';

type TipoCafe = 'CAFE_EXPRESO' | 'CAFE_FILTRADO';
type TamanoCafe = 'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE';
type VariedadCafe = 'BRASIL' | 'COLOMBIA' | 'ETIOPIA';

export function buscarProductoCafe(
    productos: Producto[],
    tipo: TipoCafe,
    tamano: TamanoCafe,
    variedad: VariedadCafe
    ): Producto | undefined {
    return productos.find(
        (producto) =>
        producto.tipo === tipo &&
        producto.tamano === tamano &&
        producto.variedad === variedad
    );
}
