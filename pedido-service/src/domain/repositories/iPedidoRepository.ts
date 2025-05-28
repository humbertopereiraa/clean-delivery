import Pedido from "../entities/pedido"

export interface IPedidoRepository {
  salvar(pedido: Pedido): Promise<Pedido>
}
