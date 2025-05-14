import { IAtualizarUsuarioInputDTO } from "../../aplication/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../aplication/dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../aplication/dtos/iInserirUsuarioOutputDTO"
import { IUsuarioService } from "../../domain/contratos/iUsuarioService"
import { Role } from "../../domain/entities/role"

interface IRequestInserirUsuario {
  body: {
    nome: string,
    email: string,
    senha: string,
    cpf: string,
    role: Role
  }
}

interface IRequestAtualizarUsuario {
  body: {
    id: string,
    nome?: string,
    email?: string,
    senha?: string,
    cpf?: string,
  }
}

interface IRequestDeletarUsuario {
  params: {
    id: string
  }
}

export class UsuarioController {

  constructor(private usuarioService: IUsuarioService) { }

  public async inserir(req: IRequestInserirUsuario): Promise<IInserirUsuarioOutputDTO> {
    try {
      const { nome, email, senha, role, cpf } = req.body
      const inserirUsuarioInputDTO: IInserirUsuarioInputDTO = {
        nome,
        email,
        senha,
        role,
        cpf
      }
      const output = await this.usuarioService.inserir(inserirUsuarioInputDTO)
      return output
      ///TODO: Add -> logger.info(`Usuário inserido com sucesso: ${JSON.stringify(output)}`)
    } catch (error: any) {
      ///TODO: Add -> logger.error(error?.message ? error?.message : `Erro no método inserir na UsuarioController : ${JSON.stringify(error)}`)
      throw error
    }
  }

  public async atualizar(req: IRequestAtualizarUsuario): Promise<IAtualizarUsuarioOutputDTO> {
    try {
      const { id, nome, email, senha, cpf } = req.body
      const atualizarUsuarioInputDTO: IAtualizarUsuarioInputDTO = {
        id,
        nome,
        email,
        senha,
        cpf
      }
      const output = await this.usuarioService.atualizar(atualizarUsuarioInputDTO)
      return output
    } catch (error) {
      throw error
    }
  }

  public async deletar(req: IRequestDeletarUsuario): Promise<void> {
    try {
      const { id } = req.params
      await this.usuarioService.deletar(id)
    } catch (error) {
      throw error
    }
  }
}
