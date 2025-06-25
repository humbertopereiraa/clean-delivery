import { Usuario } from "../entities/usuario"

export interface IUsuarioRepository {
  salvar(usuario: Usuario): Promise<void>
  obterPorId(id: string): Promise<Usuario | null>
  atualizar(usuario: Usuario): Promise<void>
  deletar(id: string): Promise<void>
}
