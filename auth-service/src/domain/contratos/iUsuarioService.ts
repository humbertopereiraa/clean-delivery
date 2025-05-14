import { IAtualizarUsuarioInputDTO } from "../../aplication/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../aplication/dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../aplication/dtos/iInserirUsuarioOutputDTO"

export interface IUsuarioService {
  inserir(usuario: IInserirUsuarioInputDTO): Promise<IInserirUsuarioOutputDTO>
  atualizar(input: IAtualizarUsuarioInputDTO): Promise<IAtualizarUsuarioOutputDTO>
  deletar(id: string): Promise<void>
}