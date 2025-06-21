import { IAutenticacaoInputDTO } from "../../application/dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../../application/dtos/iAutenticacaoOutputDTO"
import { IAuthService } from "../../domain/contratos/iAuthService"
import { ILogger } from "../../domain/contratos/iLogger"

interface IRequestAutenticar {
  body: {
    email: string
    senha: string
  }
}

export class AuthController {
  constructor(private authService: IAuthService, private logger: ILogger) { }

  public async autenticacao(req: IRequestAutenticar): Promise<IAutenticacaoOutputDTO> {
    try {
      const { email, senha } = req.body
      const input: IAutenticacaoInputDTO = {
        email,
        senha,
      }
      const output = await this.authService.autenticar(input)
      this.logger.info('Usuário logado com sucesso', output)
      return output
    } catch (error: any) {
      this.logger.error(error?.message ? error?.message : 'Erro no método logar na AuthController', error?.stack)
      throw error
    }
  }
}
