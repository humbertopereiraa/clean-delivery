import Usuario from "../entities/usuario"

export interface IUsuarioRepository {
  inserir(usuario: Usuario): Promise<Usuario>
}
