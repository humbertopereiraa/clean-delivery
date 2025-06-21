import { ErrorDomain } from "../../shared/constants"
import { UsuarioError } from "../errors/usuarioError"
import CPF from "../valueObjects/cpf"
import Email from "../valueObjects/email"
import { Role } from "./role"

export default class Usuario {

  private readonly _id: string
  private _nome: string
  private readonly _email: Email
  private _senha: string
  private readonly _cpf: CPF
  private _role: Role
  private readonly _criadoEm: Date
  private readonly _atualizadoEm: Date

  constructor(id: string, nome: string, email: string, senha: string, cpf: string, role: Role, criadoEm?: Date, atualizadoEm?: Date) {
    this._id = id
    this._nome = nome
    this._email = new Email(email)
    this._senha = senha
    this._cpf = new CPF(cpf)
    this._role = role
    this._criadoEm = criadoEm ?? new Date()
    this._atualizadoEm = atualizadoEm ?? new Date()

    this.validar()
  }

  get id(): string { return this._id }
  get nome(): string { return this._nome }
  get email(): Email { return this._email }
  get cpf(): CPF { return this._cpf }
  get role(): string { return this._role }
  get criadoEm(): Date { return this._criadoEm }
  get atualizadoEm(): Date { return this._atualizadoEm }
  get senha(): string { return this._senha }

  set nome(nome: string) { this._nome = nome }
  set role(role: Role) { this._role = role }

  private validar(): void {
    const CARACTERES_MAX_EMAIL = 255
    const CARACTERES_MAX_NOME = 150

    if (typeof this._nome !== 'string' || this._nome.length === 0) {
      throw new UsuarioError("Nome é obrigatório.", ErrorDomain.E_NOME_OBRIGATORIO)
    }

    if (!Object.values(Role).includes(this._role)) {
      throw new UsuarioError("Campo role inválido.", ErrorDomain.E_ROLE_INVALID)
    }

    if (this._email.value.length > CARACTERES_MAX_EMAIL) {
      throw new UsuarioError(`Campo email deve ter no máximo ${CARACTERES_MAX_EMAIL} caracteres.`, ErrorDomain.E_EMAIL_MAX_CARACTERES)
    }

    if (this._nome?.length > CARACTERES_MAX_NOME) {
      throw new UsuarioError(`Campo nome deve ter no máximo ${CARACTERES_MAX_NOME} caracteres.`, ErrorDomain.E_NOME_MAX_CARACTERES)
    }
  }
}
