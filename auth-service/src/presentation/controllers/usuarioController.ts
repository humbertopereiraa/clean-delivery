import { IInserirUsuarioInputDTO } from "../../aplication/dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../../aplication/dtos/iInserirUsuarioOutputDTO"
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

export class UsuarioController {

  constructor(private inserirUsuario: IInserirUsuario) { }

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
}
