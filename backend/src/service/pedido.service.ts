import type { Sequelize } from 'sequelize';
import type { CrearPedidoDTO, IItemPedido, IPedido, IPedidoRepository } from '../interfaces/pedido.interface.js';
import type { IProductoRepository } from '../interfaces/producto.interface.js';
import { PedidoRepository } from '../repository/pedido.repository.js';
import { Pedido } from '../model/pedido.js';

export class ProductoNoEncontradoError extends Error {
    constructor(public readonly productoId: number) {
        super(`El producto ${productoId} no fue encontrado`);
        this.name = 'ProductoNoEncontradoError';
    }
}

export class DatosPedidoInvalidosError extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = 'DatosPedidoInvalidosError';
    }
}

export class PedidoService {
    private readonly pedidoRepo: IPedidoRepository;

    constructor(
        private readonly productos: IProductoRepository,
        repoOrSequelize: IPedidoRepository | Sequelize,
    ) {
        if ('guardar' in repoOrSequelize || 'findAll' in repoOrSequelize || 'findById' in repoOrSequelize) {
            this.pedidoRepo = repoOrSequelize as IPedidoRepository;
        } else {
            this.pedidoRepo = new PedidoRepository(repoOrSequelize as Sequelize);
        }
    }

    async armarPedido(dto: CrearPedidoDTO): Promise<Pedido> {
        const items: IItemPedido[] = [];
        for (const { productoId, cantidad } of dto.items) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new DatosPedidoInvalidosError(
                'La cantidad debe ser un número entero mayor a cero'
            );
        }

        const producto = await this.productos.findById(productoId);

        if (!producto) {
            throw new ProductoNoEncontradoError(productoId);
        }

        items.push({
            productoId,
            cantidad,
            precioUnitario: producto.calcularPrecio()
        });
    }
        return new Pedido(items, 'PENDIENTE', undefined, dto.mesaId);
    }

    async crear(dto: CrearPedidoDTO): Promise<IPedido> {
        const pedido = await this.armarPedido(dto);
        return this.pedidoRepo.guardar(pedido);
    }

    async listar(): Promise<IPedido[]> {
        return this.pedidoRepo.findAll();
    }

    async obtener(id: number): Promise<IPedido | null> {
        return this.pedidoRepo.findById(id);
    }

    async obtenerPorId(id: number): Promise<IPedido | null> {
        return this.obtener(id);
    }
}