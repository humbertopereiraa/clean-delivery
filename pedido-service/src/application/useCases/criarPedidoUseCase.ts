import { ICriarPedidoUseCase } from "../../domain/contratos/iCriarPedidoUseCase"
import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import { IUuid } from "../../domain/contratos/iUuid"
import { IValidator } from "../../domain/contratos/iValidator"
import EnderecoEntrega from "../../domain/entities/enderecoEntrega"
import ItensPedido from "../../domain/entities/itensPedido"
import Pedido from "../../domain/entities/pedido"
import { IPedidoRepository } from "../../domain/repositories/iPedidoRepository"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import CEP from "../../domain/valueOBjects/cep"
import Telefone from "../../domain/valueOBjects/telefone"
import { ICriarPedidoInputDTO } from "../dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../dtos/iCriarPedidoOutputDTO"

export default class CriarPedidoUseCase implements ICriarPedidoUseCase {

  constructor(private pedidoRepository: IPedidoRepository, private unitOfWork: IUnitOfWork,
    private uuid: IUuid, private usuarioRepository: IUsuarioRepository,
    private validator: IValidator<ICriarPedidoInputDTO>) { }

  async execute(input: ICriarPedidoInputDTO): Promise<ICriarPedidoOutputDTO> {
    try {
      await this.unitOfWork.start()

      this.validarInputCriarPedido(input)

      const pedidoId = this.uuid.gerar()
      const { endereco, itens, clienteId, valorEntrega } = input

      const usuario = await this.usuarioRepository.obterPorId(clienteId)
      if (!usuario) {
        throw new Error('Usuário não encontrado.')
      }

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
        total: output.total.toFixed(2),
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
            preco: item.preco.toFixed(2)
          }
        })
      }
    } catch (error) {
      await this.unitOfWork.rollback()
      throw error
    }
  }

  private validarInputCriarPedido(pedido: ICriarPedidoInputDTO): void {
    if (!this.validator?.object) throw new Error("Validator não foi inicializado corretamente.")

    const schema = this.validator.object({
      clienteId: this.validator.string().optional().required("ClienteId é obrigatório"),
      valorEntrega: this.validator.number().min(0, "Valor de entrega deve ser maior ou igual a zero"),

      endereco: this.validator.object({
        rua: this.validator.string().optional().required("Rua é obrigatória"),
        numero: this.validator.string().optional().required("Número é obrigatório"),
        bairro: this.validator.string().optional().required("Bairro é obrigatório"),
        cidade: this.validator.string().optional().required("Cidade é obrigatória"),
        estado: this.validator.string().optional().required("Estado é obrigatório"),
        cep: this.validator.string().optional().required("CEP é obrigatório"),
        nomeDestinatario: this.validator.string().required("Nome do destinatário é obrigatório"),
        telefoneDestinatario: this.validator.string().required("Telefone do destinatário é obrigatório")
      }),

      itens: this.validator.array().of(
        this.validator.object({
          nome: this.validator.string().required("Nome do item é obrigatório"),
          quantidade: this.validator.number().positive("Quantidade deve ser > 0").required(),
          preco: this.validator.number().min(0, "Preço deve ser >= 0").required()
        })
      ).minArray(1, "Pedido deve ter ao menos 1 item")
    })

    schema.validate(pedido)
  }
}
