import type { EstadoPedido, IItemPedido, IPedido } from '../interfaces/pedido.interface.js';

export class Pedido implements IPedido {
    readonly id?: number;
    readonly total: number;
    readonly mesaId: number | null;

    constructor(
        readonly items: IItemPedido[],
        public estado: EstadoPedido = 'PENDIENTE',
        id?: number,
        mesaId?: number | null,
    ) {
        if (id !== undefined) this.id = id;
        this.total = Pedido.calcularTotal(items);
        this.mesaId = mesaId ?? null;
    }

    /** Suma precioUnitario x cantidad de cada item */
    static calcularTotal(items: IItemPedido[]): number {
        return items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    }
}