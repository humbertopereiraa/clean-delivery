import { InserirUsuarioInputDTO } from "../../aplication/dtos/inserirUsuarioInputDTO"
import { InserirUsuarioOutputDTO } from "../../aplication/dtos/inserirUsuarioOutputDTO"

export interface IInserirUsuario {
  execute(usuario: InserirUsuarioInputDTO): Promise<InserirUsuarioOutputDTO>
}
