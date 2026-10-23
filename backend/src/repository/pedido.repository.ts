import type { OrderItem, Sequelize } from 'sequelize';
import type { IPedido, IPedidoRepository } from '../interfaces/pedido.interface.js';
import { PedidoItemModel, PedidoModel } from '../model/pedido.model.js';


const ordenItems: OrderItem = [{ model: PedidoItemModel, as: 'items' }, 'id', 'ASC'];
const incluirItems = [{ model: PedidoItemModel, as: 'items' }];

const aDominio = (p: PedidoModel): IPedido => ({
    id: p.id,
    estado: p.estado,
    total: Number(p.total),
    items: (p.items ?? []).map((i) => ({
        id: i.id,
        productoId: i.productoId,
        cantidad: i.cantidad,
        precioUnitario: Number(i.precioUnitario),
    })),
});

export class PedidoRepository implements IPedidoRepository {
    constructor(private readonly sequelize: Sequelize) {}

    async guardar(pedido: IPedido): Promise<IPedido> {
        const id = await this.sequelize.transaction(async (t) => {
            const creado = await PedidoModel.create(
                { estado: pedido.estado, total: pedido.total },
                { transaction: t },
            );
            await PedidoItemModel.bulkCreate(
                pedido.items.map((i) => ({
                    pedidoId: creado.id,
                    productoId: i.productoId,
                    cantidad: i.cantidad,
                    precioUnitario: i.precioUnitario,
                })),
                { transaction: t },
            );
            return creado.id;
        });

        const pedidoGuardado = await this.findById(id);
        return pedidoGuardado!;
    }

    async findAll(): Promise<IPedido[]> {
        const pedidos = await PedidoModel.findAll({
            include: incluirItems,
            order: [['id', 'ASC'], ordenItems],
        });
        return pedidos.map(aDominio);
    }

    async findById(id: number): Promise<IPedido | null> {
        const pedido = await PedidoModel.findByPk(id, {
            include: incluirItems,
            order: [ordenItems],
        });
        return pedido ? aDominio(pedido) : null;
    }

    public crear = this.guardar;
    public listar = this.findAll;
    public obtener = this.findById;
}