import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../aplication/dtos/iInserirUsuarioOutputDTO"

export interface IInserirUsuario {
  execute(usuario: IInserirUsuarioInputDTO): Promise<IInserirUsuarioOutputDTO>
}
