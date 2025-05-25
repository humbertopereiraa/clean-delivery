import { ErrorDomain } from "../../shared/constants"
import isNotNullOrEmpty from "../../shared/utils"
import ItensPedidoError from "../errors/itensPedidoError"

export default class ItensPedido {

  private readonly _id: string
  private readonly _pedidoId: string
  private readonly _nome: string
  private readonly _quantidade: number
  private readonly _preco: number

  constructor(id: string, pedidoId: string, nome: string, quantidade: number, preco: number) {
    this._id = id?.trim()
    this._pedidoId = pedidoId?.trim()
    this._nome = nome?.trim()
    this._quantidade = quantidade
    this._preco = preco

    this.validar()
  }

  get id(): string { return this._id }
  get pedidoId(): string { return this._pedidoId }
  get nome(): string { return this._nome }
  get quantidade(): number { return this._quantidade }
  get preco(): number { return this._preco }

  get total(): number {
    return this._quantidade * this._preco
  }

  private validar(): void {
    if (!isNotNullOrEmpty(this._id)) throw new ItensPedidoError('O ID do item de pedido é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._pedidoId)) throw new ItensPedidoError('O ID do pedido é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._nome)) throw new ItensPedidoError('O nome é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (typeof this._quantidade !== 'number' || isNaN(this._quantidade) || this._quantidade <= 0) {
      throw new ItensPedidoError('Quantidade deve ser um número maior que zero.', ErrorDomain.E_FORMATO_INVALIDO)
    }
    if (typeof this._preco !== 'number' || isNaN(this._preco) || this._preco < 0) {
      throw new ItensPedidoError('O preço deve ser um número não negativo.', ErrorDomain.E_FORMATO_INVALIDO)
    }
  }
}
