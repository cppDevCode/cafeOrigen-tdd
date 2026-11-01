import type {
    IProducto,
    IProductoRepository,
    ProductoResponseDTO,
    VariedadCafe,
} from '../interfaces/producto.interface.js';

const descripcionesVariedad: Record<VariedadCafe, string> = {
    COLOMBIA: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    ETIOPIA: 'Acidez muy viva, cuerpo ligero y notas frutales',
    BRASIL: 'Acidez baja, cuerpo denso y notas de avellana',
};

function aDTO(p: IProducto): ProductoResponseDTO {
    return {
        id: p.id,
        nombre: p.nombre,
        tipo: p.tipo,
        precioBase: p.precioBase,
        ...(p.tamano !== undefined && { tamano: p.tamano }),
        ...(p.gramos !== undefined && { gramos: p.gramos }),
        ...(p.variedad !== undefined && {
            variedad: p.variedad,
            descripcionVariedad: descripcionesVariedad[p.variedad],
        }),
        precio: p.calcularPrecio(),
    };
}

export class ProductoService {
    constructor(private readonly repo: IProductoRepository) {}

    async listar(): Promise<ProductoResponseDTO[]> {
        const productos = await this.repo.findAll();
        return productos.map(aDTO);
    }

    async obtenerPorId(id: number): Promise<ProductoResponseDTO | null> {
        const producto = await this.repo.findById(id);
        return producto ? aDTO(producto) : null;
    }
}