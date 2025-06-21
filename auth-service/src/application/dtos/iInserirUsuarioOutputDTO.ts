import { Role } from "../../domain/entities/role"

export interface IInserirUsuarioOutputDTO {
  id: string
  nome: string
  email: string
  cpf: string
  role: Role
  criadoEm: Date
}