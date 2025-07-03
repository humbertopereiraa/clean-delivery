import { ErrorDomain } from "../../shared/constants"
import isNotNullOrEmpty from "../../shared/utils"
import EntregaError from "../errors/entregaError"

export namespace NEntrega {
  export type status = "aceita" | "em_transito" | "entregue"
}

export default class Entrega {

  private readonly _id: string
  private readonly _pedidoId: string
  private readonly _entregadorId: string
  private readonly _aceitaEm: Date
  private readonly _entregueEm?: Date
  private readonly _status: NEntrega.status
  private readonly _observacoes?: string

  constructor(id: string, pedidoId: string, entregadorId: string, status: NEntrega.status, aceitaEm: Date, entregueEm?: Date, observacoes?: string) {
    this._id = id
    this._pedidoId = pedidoId
    this._entregadorId = entregadorId
    this._status = status
    this._aceitaEm = aceitaEm
    this._entregueEm = entregueEm
    this._observacoes = observacoes

    this.validar()
  }

  get id(): string { return this._id }
  get pedidoId(): string { return this._pedidoId }
  get entregadorId(): string { return this._entregadorId }
  get aceitaEm(): Date { return this._aceitaEm }
  get entregueEm(): Date | undefined { return this._entregueEm }
  get status(): NEntrega.status { return this._status }
  get observacoes(): string | undefined { return this._observacoes }

  private validar(): void {
    if (!isNotNullOrEmpty(this._id)) throw new EntregaError('O ID da entrega é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._pedidoId)) throw new EntregaError('O ID do pedido é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._entregadorId)) throw new EntregaError('O ID do entregador é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    const statusValidos: NEntrega.status[] = ["aceita", "em_transito", "entregue"]
    if (!statusValidos.includes(this._status)) throw new EntregaError(`Status '${this._status}' inválido para a entrega.`, ErrorDomain.E_FORMATO_INVALIDO)
    if (!(this._aceitaEm instanceof Date) || isNaN(this._aceitaEm?.getTime())) throw new EntregaError('A data de aceitação é inválida.', ErrorDomain.E_FORMATO_INVALIDO)
    if (this._status === "entregue") {
      if (!(this._entregueEm instanceof Date) || isNaN(this._entregueEm.getTime())) {
        throw new EntregaError('A data de entrega é obrigatória quando o status é "entregue".', ErrorDomain.E_CAMPO_OBRIGATORIO)
      }
    }
  }
}
