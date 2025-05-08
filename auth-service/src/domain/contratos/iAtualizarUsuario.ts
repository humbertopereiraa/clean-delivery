import { IAtualizarUsuarioInputDTO } from "../../aplication/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../aplication/dtos/iAtualizarUsuarioOutputDTO"

export interface IAtualizarUsuario {
  execute(input: IAtualizarUsuarioInputDTO): Promise<IAtualizarUsuarioOutputDTO>
}
