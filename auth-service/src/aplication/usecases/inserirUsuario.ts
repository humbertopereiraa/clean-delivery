import { IEncrypter } from "../../domain/contratos/iEncrypter"
import { IInserirUsuario } from "../../domain/contratos/iInserirUsuario"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import { InserirUsuarioInputDTO } from "../dtos/inserirUsuarioInputDTO"
import { InserirUsuarioOutputDTO } from "../dtos/inserirUsuarioOutputDTO"

export class InserirUsuario implements IInserirUsuario {
  constructor(private usuarioRepository: IUsuarioRepository, private encrypter: IEncrypter) { }

  async execute(usuario: InserirUsuarioInputDTO): Promise<InserirUsuarioOutputDTO> {
    const { nome, email, senha, cpf, role } = usuario
    const encryptedPassword = this.encrypter.encryptPassword(senha)
    const newUsuario = new Usuario(nome, email, encryptedPassword, cpf, role)
    const usuarioInserido = await this.usuarioRepository.inserir(newUsuario)
    const outputDTO: InserirUsuarioOutputDTO = {
      id: usuarioInserido.id,
      nome: usuarioInserido.nome,
      email: usuarioInserido.email.value,
      cpf: usuarioInserido.cpf.value,
      role: usuarioInserido.role,
      criadoEm: usuarioInserido.criadoEm,
    }
    return outputDTO
  }
}
