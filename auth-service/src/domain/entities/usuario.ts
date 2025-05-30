import { ErrorDomain } from "../../shared/constants"
import { UsuarioError } from "../errors/usuarioError"
import CPF from "../valueObjects/cpf"
import Email from "../valueObjects/email"
import { Role } from "./role"

export default class Usuario {

  public readonly id: string
  public nome: string
  public readonly email: Email
  private _senha: string
  public readonly cpf: CPF
  public role: Role
  public readonly criadoEm: Date
  public readonly atualizadoEm: Date

  constructor(id: string, nome: string, email: string, senha: string, cpf: string, role: Role, criadoEm?: Date, atualizadoEm?: Date) {
    this.id = id
    this.nome = nome
    this.email = new Email(email)
    this._senha = senha
    this.cpf = new CPF(cpf)
    this.role = role
    this.criadoEm = criadoEm ?? new Date()
    this.atualizadoEm = atualizadoEm ?? new Date()

    this.validar()
  }

  public get senha(): string {
    return this._senha
  }

  private validar(): void {
    const CARACTERES_MAX_EMAIL = 255
    const CARACTERES_MAX_NOME = 150

    if (typeof this.nome !== 'string' || this.nome.length === 0) {
      throw new UsuarioError("Nome é obrigatório.", ErrorDomain.E_NOME_OBRIGATORIO)
    }

    if (!Object.values(Role).includes(this.role)) {
      throw new UsuarioError("Campo role inválido.", ErrorDomain.E_ROLE_INVALID)
    }

    if (this.email.value.length > CARACTERES_MAX_EMAIL) {
      throw new UsuarioError(`Campo email deve ter no máximo ${CARACTERES_MAX_EMAIL} caracteres.`, ErrorDomain.E_EMAIL_MAX_CARACTERES)
    }

    if(this.nome?.length > CARACTERES_MAX_NOME) {
      throw new UsuarioError(`Campo nome deve ter no máximo ${CARACTERES_MAX_NOME} caracteres.`, ErrorDomain.E_NOME_MAX_CARACTERES)
    }
  }
}
