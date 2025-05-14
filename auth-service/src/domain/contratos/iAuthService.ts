import { IAutenticacaoInputDTO } from "../../aplication/dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../../aplication/dtos/iAutenticacaoOutputDTO"

export interface IAuthService {
  autenticar(input: IAutenticacaoInputDTO): Promise<IAutenticacaoOutputDTO>
}