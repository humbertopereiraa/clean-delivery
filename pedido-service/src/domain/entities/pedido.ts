import { ErrorDomain } from "../../shared/constants"
import isNotNullOrEmpty from "../../shared/utils"
import PedidoError from "../errors/pedidoError"
import EnderecoEntrega from "./enderecoEntrega"
import ItensPedido from "./itensPedido"

export namespace NPedido {
  export type status = "preparando" | "pronto" | "em_entrega" | "entregue"
}

export default class Pedido {

  private readonly _id: string
  private readonly _clienteId: string
  private readonly _enderecoEntrega: EnderecoEntrega
  private readonly _itens: ItensPedido[]
  private readonly _valorEntrega: number
  private _status: NPedido.status
  private readonly _criadoEm: Date
  private readonly _atualizadoEm: Date

  constructor(id: string, clienteId: string, enderecoEntrega: EnderecoEntrega, itens: ItensPedido[], valorEntrega: number, status: NPedido.status, criadoEm?: Date, atualizadoEm?: Date) {
    this._id = id?.trim()
    this._clienteId = clienteId?.trim()
    this._enderecoEntrega = enderecoEntrega
    this._itens = itens
    this._valorEntrega = valorEntrega
    this._status = status
    this._criadoEm = criadoEm ?? new Date()
    this._atualizadoEm = atualizadoEm ?? new Date()

    this.validar()
  }

  get id(): string { return this._id }
  get clienteId(): string { return this._clienteId }
  get enderecoEntrega(): EnderecoEntrega { return this._enderecoEntrega }
  get itens(): ItensPedido[] { return this._itens }
  get valorEntrega(): number { return this._valorEntrega }
  get status(): NPedido.status { return this._status }
  get criadoEm(): Date { return this._criadoEm }
  get atualizadoEm(): Date { return this._atualizadoEm }

  private validar(): void {
    if (!isNotNullOrEmpty(this._id)) throw new PedidoError('O ID do endereço é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._clienteId)) throw new PedidoError('O ID do cliente é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!this._enderecoEntrega || Object.keys(this._enderecoEntrega).length === 0) throw new PedidoError('O endereço de entrega é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!this._itens || !Array.isArray(this._itens) || this._itens.length === 0) throw new PedidoError('O pedido deve conter pelo menos um item.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (typeof this._valorEntrega !== 'number' || isNaN(this._valorEntrega) || this._valorEntrega < 0) throw new PedidoError('O valor de entrega deve ser um número não negativo.', ErrorDomain.E_FORMATO_INVALIDO)
    const statusValidos: NPedido.status[] = ["preparando", "pronto", "em_entrega", "entregue"]
    if (!statusValidos.includes(this._status)) throw new PedidoError(`Status '${this._status}' inválido para o pedido.`, ErrorDomain.E_FORMATO_INVALIDO)
    if (!(this._criadoEm instanceof Date) || isNaN(this._criadoEm?.getTime())) throw new PedidoError('A data de criação é inválida.', ErrorDomain.E_FORMATO_INVALIDO)
    if (!(this._atualizadoEm instanceof Date) || isNaN(this._atualizadoEm?.getTime())) throw new PedidoError('A data de atualização é inválida.', ErrorDomain.E_FORMATO_INVALIDO)
  }

}

