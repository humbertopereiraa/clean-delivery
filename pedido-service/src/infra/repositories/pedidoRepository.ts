import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import EnderecoEntrega from "../../domain/entities/enderecoEntrega"
import ItensPedido from "../../domain/entities/itensPedido"
import Pedido from "../../domain/entities/pedido"
import { IPedidoRepository } from "../../domain/repositories/iPedidoRepository"
import CEP from "../../domain/valueOBjects/cep"
import Telefone from "../../domain/valueOBjects/telefone"

export default class PedidoRepository implements IPedidoRepository {

  constructor(private unitOfWork: IUnitOfWork) { }

  async salvar(pedido: Pedido): Promise<Pedido> {
    try {
      const conexao = this.unitOfWork.getConnection()

      const sql = 'INSERT INTO pedidos (id, cliente_id, status, valor_entrega) VALUES (?, ?, ?, ?) RETURNING *'
      const [outputPedido] = await conexao.query(sql, [pedido.id, pedido.clienteId, pedido.status, pedido.valorEntrega])

      const endereco = pedido.enderecoEntrega
      const sql2 = `INSERT INTO enderecos_entrega (id, pedido_id, rua, numero, bairro, cidade, estado, cep, complemento, nome_destinatario, telefone_destinatario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
      const [outputEndereco] = await conexao.query(sql2, [
        endereco.id,
        endereco.pedidoId,
        endereco.rua,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep.value,
        endereco.complemento ?? null,
        endereco.nomeDestinatario,
        endereco.telefoneDestinatario.value
      ])
      const enderecoEntrega = new EnderecoEntrega(
        outputEndereco.id,
        outputEndereco.pedido_id,
        outputEndereco.rua,
        outputEndereco.numero,
        outputEndereco.bairro,
        outputEndereco.cidade,
        outputEndereco.estado,
        CEP.create(outputEndereco.cep),
        outputEndereco.nome_destinatario,
        Telefone.create(outputEndereco.telefone_destinatario),
        outputEndereco.complemento
      )

      const itensPedido: ItensPedido[] = []
      for (const item of pedido.itens) {
        const sql = `INSERT INTO itens_pedido (id, pedido_id, nome, quantidade, preco) VALUES (?, ?, ?, ?, ?) RETURNING *`
        const [outputItem] = await conexao.query(sql, [item.id, item.pedidoId, item.nome, item.quantidade, item.preco])
        const quantidade = typeof outputItem.quantidade === 'string' ? parseInt(outputItem.quantidade) : outputItem.quantidade
        const preco = typeof outputItem.preco === 'string' ? parseFloat(outputItem.preco) : outputItem.preco
        itensPedido.push(new ItensPedido(outputItem.id, outputItem.pedido_id, outputItem.nome, quantidade, preco))
      }

      const valorDaEntrega = typeof outputPedido.valor_entrega === 'string' ? parseFloat(outputPedido.valor_entrega) : outputPedido.valor_entrega
      const newPedido = new Pedido(outputPedido.id, outputPedido.cliente_id, enderecoEntrega, itensPedido, valorDaEntrega, outputPedido.status, new Date(outputPedido.criado_em), new Date(outputPedido.atualizado_em))
      return newPedido
    } catch (error) {
      throw error
    }
  }

}
