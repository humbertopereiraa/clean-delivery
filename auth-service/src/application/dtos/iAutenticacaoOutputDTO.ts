import { Role } from "../../domain/entities/role"

export interface IAutenticacaoOutputDTO {
  id: string
  nome: string
  email: string
  cpf: string
  role: Role
  token: string
}