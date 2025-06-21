import { Role } from "../../domain/entities/role"

export interface IInserirUsuarioInputDTO {
  nome: string
  email: string
  senha: string
  cpf: string
  role: Role
}