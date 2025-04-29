import { Role } from "../../domain/entities/role"

export interface InserirUsuarioOutputDTO {
  id: string
  nome: string
  email: string
  cpf: string
  role: Role
  criadoEm: Date
}