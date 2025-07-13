import { IConexao } from "../../domain/contratos/iConexao"
import { ILogger } from "../../domain/contratos/iLogger"
import Entrega from "../../domain/entities/entrega"
import { IEntregaRepository } from "../../domain/repositories/iEntregaRepository"

export class EntregaRepository implements IEntregaRepository {

  constructor(private conexao: IConexao, private logger: ILogger) { }

  async salvar(entrega: Entrega): Promise<Entrega> {
    try {
      const sql = ` INSERT INTO entregas (id, pedido_id, entregador_id, status, aceita_em, entregue_em) VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
      const [output] = await this.conexao.query(sql, [
        entrega.id,
        entrega.pedidoId,
        entrega.entregadorId,
        entrega.status,
        entrega.aceitaEm,
        entrega.entregueEm ?? null
      ])

      return this.mapToEntidadeEntrega(output)
    } catch (error) {
      this.logger.error('Erro ao salvar Entrega', error)
      throw error
    }
  }

  async buscarPorPedidoId(pedidoId: string): Promise<Entrega | null> {
    try {
      const sql = 'SELECT * FROM entregas WHERE pedido_id = ?'
      const [output] = await this.conexao.query(sql, [pedidoId])
      return output ? this.mapToEntidadeEntrega(output) : null
    } catch (error) {
      this.logger.error('Erro ao buscar entrega por pedidoId', error)
      throw error
    }
  }

  async atualizar(entrega: Entrega): Promise<void> {
    try {
      const sql = 'UPDATE entregas SET status = ?, entregue_em = ? WHERE id = ?'
      await this.conexao.query(sql, [
        entrega.status,
        entrega.entregueEm ?? null,
        entrega.id
      ])
    } catch (error) {
      this.logger.error('Erro ao atualizar entrega', error)
      throw error
    }
  }

  async listarPorEntregador(entregadorId: string): Promise<Entrega[]> {
    try {
      const sql = 'SELECT * FROM entregas WHERE entregador_id = ? ORDER BY aceita_em DESC'
      const output = await this.conexao.query(sql, [entregadorId]) ?? []
      return output.map((item: any) => this.mapToEntidadeEntrega(item))
    } catch (error) {
      this.logger.error('Erro ao listar entregas por entregadorId', error)
      throw error
    }
  }

  private mapToEntidadeEntrega(row: Record<string, any>): Entrega {
    const aceitaEm = new Date(row?.aceita_em)
    const entregueEm = row?.entregue_em ? new Date(row?.entregue_em) : undefined

    return new Entrega(
      row.id,
      row.pedido_id,
      row.entregador_id,
      row.status,
      aceitaEm,
      entregueEm
    )
  }
}
