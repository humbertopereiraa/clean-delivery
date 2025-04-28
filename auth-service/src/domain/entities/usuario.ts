import { uuid } from "../../infra/token/uuid"
import { E_NOME_OBRIGATORIO, E_ROLE_INVALID } from "../../shared/constants"
import { UsuarioError } from "../errors/usuarioError"
import CPF from "./cpf"
import Email from "./email"
import { Role } from "./role"

export default class Usuario {

  public readonly id: string
  public nome: string
  public readonly email: Email
  private senha: string
  public readonly cpf: CPF
  public role: Role
  public readonly criadoEm: Date

  constructor(nome: string, email: string, senha: string, cpf: string, role: Role, id?: string, criadoEm?: Date) {
    this.id = id ?? uuid.gerar()
    this.nome = nome
    this.email = new Email(email)
    this.senha = senha
    this.cpf = new CPF(cpf)
    this.role = role
    this.criadoEm = criadoEm ?? new Date()

    this.validar()
  }

  public get senhaHash(): string {
    return this.senha
  }

  private validar(): void {
    if (typeof this.nome !== 'string' || this.nome.length === 0) {
      throw new UsuarioError("Nome é obrigatório.", E_NOME_OBRIGATORIO)
    }

    if (!Object.values(Role).includes(this.role)) {
      throw new UsuarioError("Campo role inválido.", E_ROLE_INVALID)
    }
  }
}
