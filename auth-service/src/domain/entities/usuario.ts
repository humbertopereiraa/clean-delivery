import { uuid } from "../../infra/token/uuid"
import { E_NOME_OBRIGATORIO, E_ROLE_INVALID, E_EMAIL_MAX_CARACTERES, E_NOME_MAX_CARACTERES } from "../../shared/constants"
import { UsuarioError } from "../errors/usuarioError"
import CPF from "./cpf"
import Email from "./email"
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

  constructor(nome: string, email: string, senha: string, cpf: string, role: Role, id?: string, criadoEm?: Date, atualizadoEm?: Date) {
    this.id = id ?? uuid.gerar()
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
      throw new UsuarioError("Nome é obrigatório.", E_NOME_OBRIGATORIO)
    }

    if (!Object.values(Role).includes(this.role)) {
      throw new UsuarioError("Campo role inválido.", E_ROLE_INVALID)
    }

    if (this.email.value.length > CARACTERES_MAX_EMAIL) {
      throw new UsuarioError(`Campo email deve ter no máximo ${CARACTERES_MAX_EMAIL} caracteres.`, E_EMAIL_MAX_CARACTERES)
    }

    if(this.nome?.length > CARACTERES_MAX_NOME) {
      throw new UsuarioError(`Campo nome deve ter no máximo ${CARACTERES_MAX_NOME} caracteres.`, E_NOME_MAX_CARACTERES)
    }
  }
}
