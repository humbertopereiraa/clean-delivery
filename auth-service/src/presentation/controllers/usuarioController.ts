import { IAtualizarUsuarioInputDTO } from "../../aplication/dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../../aplication/dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../aplication/dtos/iInserirUsuarioOutputDTO"
import { IAtualizarUsuario } from "../../domain/contratos/iAtualizarUsuario"
import { IDeletarUsuario } from "../../domain/contratos/iDeletarUsuario"
import { IInserirUsuario } from "../../domain/contratos/iInserirUsuario"
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

  constructor(private inserirUsuario: IInserirUsuario, private atualizarUsuario: IAtualizarUsuario, private deletarUsuario: IDeletarUsuario) { }

  public inserir(req: IRequestInserirUsuario): Promise<IInserirUsuarioOutputDTO> {
    return new Promise<IInserirUsuarioOutputDTO>(async (resolve, reject) => {
      try {
        const { nome, email, senha, role, cpf } = req.body
        const inserirUsuarioInputDTO: IInserirUsuarioInputDTO = {
          nome,
          email,
          senha,
          role,
          cpf
        }
        const output = await this.inserirUsuario.execute(inserirUsuarioInputDTO)
        resolve(output)
        ///TODO: Add -> logger.info(`Usuário inserido com sucesso: ${JSON.stringify(output)}`)
      } catch (error: any) {
        ///TODO: Add -> logger.error(error?.message ? error?.message : `Erro no método inserir na UsuarioController : ${JSON.stringify(error)}`)
        reject(error)
      }
    })
  }

  public async atualizar(req: IRequestAtualizarUsuario): Promise<IAtualizarUsuarioOutputDTO> {
    return new Promise<IAtualizarUsuarioOutputDTO>(async (resolve, reject) => {
      try {
        const { id, nome, email, senha, cpf } = req.body
        const atualizarUsuarioInputDTO: IAtualizarUsuarioInputDTO = {
          id,
          nome,
          email,
          senha,
          cpf
        }
        const output = await this.atualizarUsuario.execute(atualizarUsuarioInputDTO)
        resolve(output)
      } catch (error) {
        reject(error)
      }
    })
  }

  public async deletar(req: IRequestDeletarUsuario): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { id } = req.params
        await this.deletarUsuario.execute(id)
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
