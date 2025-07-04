import Entrega from "../entities/entrega"

export interface IEntregaRepository {
  salvar(entrega: Entrega): Promise<Entrega>
  buscarPorPedidoId(pedidoId: string): Promise<Entrega | null>
  atualizar(entrega: Entrega): Promise<void>
  listarPorEntregador(entregadorId: string): Promise<Entrega[]>
}
