import Usuario from "../entities/usuario"

export interface IUsuarioRepository {
  buscarPorId(id: string): Promise<Usuario | undefined>
  inserir(usuario: Usuario): Promise<Usuario>
  atualizar(usuario: Usuario): Promise<Usuario>
  deletar(id: string): Promise<void>
}
