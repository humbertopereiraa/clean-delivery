import { Role } from "../../domain/entities/role"

export interface InserirUsuarioInputDTO {
  nome: string
  email: string
  senha: string
  cpf: string
  role: Role
}