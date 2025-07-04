import { IAceitarEntregaUseCase } from "../../domain/contratos/iAceitarEntregaUseCase"
import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import { IUuid } from "../../domain/contratos/iUuid"
import { IValidator } from "../../domain/contratos/iValidator"
import Entrega from "../../domain/entities/entrega"
import { IEntregaRepository } from "../../domain/repositories/iEntregaRepository"
import { IPedidoRepository } from "../../domain/repositories/iPedidoRepository"
import { IAceitarEntregaInputDTO } from "../dtos/iAceitarEntregaInputDTO"
import { IAceitarEntregaOutputDTO } from "../dtos/iAceitarEntregaOutputDTO"

export default class AceitarEntregaUseCase implements IAceitarEntregaUseCase {

  constructor(private pedidoRepository: IPedidoRepository, private entregaRepository: IEntregaRepository,
    private unitOfWork: IUnitOfWork, private uuid: IUuid, private validator: IValidator<IAceitarEntregaInputDTO>) { }

  async execute(input: IAceitarEntregaInputDTO): Promise<IAceitarEntregaOutputDTO> {
    try {
      await this.unitOfWork.start()
      this.validarInputAceitarEntrega(input)

      const { pedidoId, entregadorId } = input

      const pedidoPorId = await this.pedidoRepository.buscarPorId(pedidoId)
      if (!pedidoPorId) throw new Error('Pedido não encontrado.')
      if (pedidoPorId.status !== 'pronto') throw new Error('Pedido não está pronto para ser aceito.')

      const entregaExistente = await this.entregaRepository.buscarPorPedidoId(pedidoId)
      if (entregaExistente) throw new Error('Este pedido já foi aceito.')

      const entregaId = this.uuid.gerar()
      const entrega = new Entrega(entregaId, pedidoId, entregadorId, 'aceita', new Date())

      await this.entregaRepository.salvar(entrega)
      await this.unitOfWork.commit()

      //TODO: Publicar evento na mensageria (Entrega_aceita) --> notificacoes-service vai escutar 

      return {
        id: entrega.id,
        pedidoId: entrega.pedidoId,
        entregadorId: entrega.entregadorId,
        status: entrega.status,
        aceitaEm: entrega.aceitaEm
      }
    } catch (error) {
      await this.unitOfWork.rollback()
      throw error
    }
  }

  private validarInputAceitarEntrega(entrega: IAceitarEntregaInputDTO): void {
    if (!this.validator?.object) throw new Error("Validator não foi inicializado corretamente.")

    const schema = this.validator.object({
      pedidoId: this.validator.string().optional().required("pedidoId é obrigatório"),
      entregadorId: this.validator.string().optional().required("entregadorId é obrigatório"),
    })

    schema.validate(entrega)
  }
}
