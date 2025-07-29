import { ETipoUsuario } from "../core/enums/tipo-usuario.enum"

export interface IUsuario {
  id: string
  nome: string
  email: string
  role: ETipoUsuario
  cpf: string
  avatar?: string
}
