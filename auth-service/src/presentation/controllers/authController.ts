import { IAutenticacaoInputDTO } from "../../aplication/dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../../aplication/dtos/iAutenticacaoOutputDTO"
import { IAutenticacao } from "../../domain/contratos/iAutenticacao"

interface IRequestAutenticar {
  body: {
    email: string
    senha: string
  }
}

export class AuthController {
  constructor(private autenticar: IAutenticacao) { }

  public async autenticacao(req: IRequestAutenticar): Promise<IAutenticacaoOutputDTO> {
    try {
      const { email, senha } = req.body
      const input: IAutenticacaoInputDTO = {
        email,
        senha,
      }
      const output = await this.autenticar.execute(input)
      // TODO: Adicionar log: logger.info(`Usuário logado com sucesso: ${JSON.stringify(output)}`)
      return output
    } catch (error: any) {
      // TODO: Adicionar log de erro: logger.error(error?.message ? error?.message : `Erro no método logar na AuthController : ${JSON.stringify(error)}`)
      throw error
    }
  }
}
