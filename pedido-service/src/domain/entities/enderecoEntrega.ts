import { ErrorDomain } from "../../shared/constants"
import isNotNullOrEmpty from "../../shared/utils"
import EnderecoEntregaError from "../errors/enderecoEntregaError"
import CEP from "../valueOBjects/cep"
import Telefone from "../valueOBjects/telefone"

export default class EnderecoEntrega {

  private readonly _id: string
  private readonly _pedidoId: string
  private readonly _rua: string
  private readonly _numero: string
  private readonly _bairro: string
  private readonly _cidade: string
  private readonly _estado: string
  private readonly _cep: CEP
  private readonly _nomeDestinatario: string
  private readonly _telefoneDestinatario: Telefone
  private readonly _complemento?: string

  constructor(id: string, pedidoId: string, rua: string, numero: string, bairro: string, cidade: string, estado: string, cep: CEP, nomeDestinatario: string, telefoneDestinatario: Telefone, complemento?: string) {
    this._id = id?.trim()
    this._pedidoId = pedidoId?.trim()
    this._rua = rua?.trim()
    this._numero = numero?.trim()
    this._bairro = bairro?.trim()
    this._cidade = cidade?.trim()
    this._estado = estado?.trim().toUpperCase()
    this._cep = cep
    this._nomeDestinatario = nomeDestinatario?.trim()
    this._telefoneDestinatario = telefoneDestinatario
    this._complemento = complemento?.trim()

    this.validar()
  }

  get id(): string { return this._id }
  get pedidoId(): string { return this._pedidoId }
  get rua(): string { return this._rua }
  get numero(): string { return this._numero }
  get bairro(): string { return this._bairro }
  get cidade(): string { return this._cidade }
  get estado(): string { return this._estado }
  get cep(): CEP { return this._cep }
  get nomeDestinatario(): string { return this._nomeDestinatario }
  get telefoneDestinatario(): Telefone { return this._telefoneDestinatario }
  get complemento(): string | undefined { return this._complemento }

  private validar(): void {
    if (!isNotNullOrEmpty(this._id)) throw new EnderecoEntregaError('O ID do endereço é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._pedidoId)) throw new EnderecoEntregaError('O ID do pedido é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._rua)) throw new EnderecoEntregaError('A rua é obrigatória.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._numero)) throw new EnderecoEntregaError('O número é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._bairro)) throw new EnderecoEntregaError('O bairro é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._cidade)) throw new EnderecoEntregaError('A cidade é obrigatória.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!isNotNullOrEmpty(this._estado)) throw new EnderecoEntregaError('O estado é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
    if (!/^[A-Z]{2}$/.test(this._estado)) throw new EnderecoEntregaError('O estado deve ser uma UF válida de 2 letras (Ex: ES, SP, RJ).', ErrorDomain.E_FORMATO_INVALIDO)
    if (!isNotNullOrEmpty(this._nomeDestinatario)) throw new EnderecoEntregaError('O nome do destinatário é obrigatório.', ErrorDomain.E_CAMPO_OBRIGATORIO)
  }
}
