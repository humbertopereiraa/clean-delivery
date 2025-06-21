import { IAutenticacaoInputDTO } from "../../application/dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../../application/dtos/iAutenticacaoOutputDTO"

export interface IAuthService {
  autenticar(input: IAutenticacaoInputDTO): Promise<IAutenticacaoOutputDTO>
}