import Pedido from "../entities/pedido"

export interface IPedidoRepository {
  salvar(pedido: Pedido): Promise<Pedido>
  buscarPorId(pedidoId: string): Promise<Pedido | null>
}
