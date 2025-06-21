import { IAtualizarUsuarioInputDTO } from "../../application/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../application/dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../../application/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../application/dtos/iInserirUsuarioOutputDTO"
import { ILogger } from "../../domain/contratos/iLogger"
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

  constructor(private usuarioService: IUsuarioService, private logger: ILogger) { }

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
      this.logger.info('Usuário inserido com sucesso', output)
      return output
    } catch (error: any) {
      this.logger.error(error?.message ? error?.message : 'Erro no método inserir no UsuarioController', error?.stack)
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
      this.logger.info('Usuário atualizado com sucesso', output)
      return output
    } catch (error: any) {
      this.logger.error(error?.message ? error?.message : 'Erro no método atualizar no UsuarioController', error?.stack)
      throw error
    }
  }

  public async deletar(req: IRequestDeletarUsuario): Promise<void> {
    try {
      const { id } = req.params
      await this.usuarioService.deletar(id)
      this.logger.info('Usuário deletado com sucesso', { id: id })
    } catch (error: any) {
      this.logger.error(error?.message ? error?.message : 'Erro no método deletar no UsuarioController', error?.stack)
      throw error
    }
  }
}
