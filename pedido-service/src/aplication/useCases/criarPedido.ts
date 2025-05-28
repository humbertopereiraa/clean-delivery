import { ICriarPedido } from "../../domain/contratos/iCriarPedido"
import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import { IUuid } from "../../domain/contratos/iUuid"
import EnderecoEntrega from "../../domain/entities/enderecoEntrega"
import ItensPedido from "../../domain/entities/itensPedido"
import Pedido from "../../domain/entities/pedido"
import { IPedidoRepository } from "../../domain/repositories/iPedidoRepository"
import CEP from "../../domain/valueOBjects/cep"
import Telefone from "../../domain/valueOBjects/telefone"
import { ICriarPedidoInputDTO } from "../dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../dtos/iCriarPedidoOutputDTO"

export default class CriarPedido implements ICriarPedido {

  constructor(private pedidoRepository: IPedidoRepository, private unitOfWork: IUnitOfWork, private uuid: IUuid) { }

  async execute(input: ICriarPedidoInputDTO): Promise<ICriarPedidoOutputDTO> {
    try {
      await this.unitOfWork.start()
      const pedidoId = this.uuid.gerar()

      const { endereco, itens, clienteId, valorEntrega } = input

      //TODO: Consultar no cache de usuários, se código clienteId é válido

      //TODO: Adicionar validações no input

      const enderecoInput = new EnderecoEntrega(
        this.uuid.gerar(),
        pedidoId,
        endereco.rua,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        CEP.create(endereco.cep),
        endereco.nomeDestinatario,
        Telefone.create(endereco.telefoneDestinatario),
        endereco.complemento
      )

      const itensPedidoInput = itens.map(item => new ItensPedido(this.uuid.gerar(), pedidoId, item.nome, item.quantidade, item.preco))
      const pedidoInput = new Pedido(pedidoId, clienteId, enderecoInput, itensPedidoInput, valorEntrega, 'preparando')

      const output = await this.pedidoRepository.salvar(pedidoInput)
      await this.unitOfWork.commit()

      return {
        id: pedidoId,
        total: output.total,
        status: output.status,
        criadoEm: output.criadoEm.toISOString(),
        enderecoEntrega: {
          id: enderecoInput.id,
          rua: enderecoInput.rua,
          numero: enderecoInput.numero,
          bairro: enderecoInput.bairro,
          cidade: enderecoInput.cidade,
          estado: enderecoInput.estado,
          cep: enderecoInput.cep.value,
          complemento: enderecoInput.complemento,
          nomeDestinatario: enderecoInput.nomeDestinatario,
          telefoneDestinatario: enderecoInput.telefoneDestinatario.value,
        },
        itens: itensPedidoInput.map(item => {
          return {
            id: item.id,
            pedidoId: item.pedidoId,
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco
          }
        })
      }
    } catch (error) {
      await this.unitOfWork.rollback()
      throw error
    }
  }
}
