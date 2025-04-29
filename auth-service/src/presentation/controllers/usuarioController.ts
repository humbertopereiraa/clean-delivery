import { InserirUsuarioInputDTO } from "../../aplication/dtos/inserirUsuarioInputDTO"
import { InserirUsuarioOutputDTO } from "../../aplication/dtos/inserirUsuarioOutputDTO"
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

  public inserir(req: IRequestInserirUsuario): Promise<InserirUsuarioOutputDTO> {
    return new Promise<InserirUsuarioOutputDTO>(async (resolve, reject) => {
      try {
        const { nome, email, senha, role, cpf } = req.body
        const inserirUsuarioInputDTO: InserirUsuarioInputDTO = {
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
