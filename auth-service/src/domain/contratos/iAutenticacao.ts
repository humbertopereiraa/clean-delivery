import { IAutenticacaoInputDTO } from "../../aplication/dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../../aplication/dtos/iAutenticacaoOutputDTO"

export interface IAutenticacao {
  execute(input: IAutenticacaoInputDTO): Promise<IAutenticacaoOutputDTO>
}