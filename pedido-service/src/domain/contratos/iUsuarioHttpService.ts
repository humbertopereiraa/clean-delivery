import { Usuario } from "../entities/usuario"

export interface IUsuarioHttpService {
  buscarUsuarioPorId(id: string): Promise<Usuario | null>
}
