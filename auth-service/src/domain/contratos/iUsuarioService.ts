import { IAtualizarUsuarioInputDTO } from "../../application/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../application/dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../../application/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../application/dtos/iInserirUsuarioOutputDTO"

export interface IUsuarioService {
  inserir(usuario: IInserirUsuarioInputDTO): Promise<IInserirUsuarioOutputDTO>
  atualizar(input: IAtualizarUsuarioInputDTO): Promise<IAtualizarUsuarioOutputDTO>
  deletar(id: string): Promise<void>
}