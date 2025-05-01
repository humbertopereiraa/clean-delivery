import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"

export interface IValidatorInserirUsuario {
  execute(usuario: IInserirUsuarioInputDTO): IValidatorInserirUsuario
}
