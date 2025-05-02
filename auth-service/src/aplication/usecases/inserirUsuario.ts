import { IEncrypter } from "../../domain/contratos/iEncrypter"
import { IInserirUsuario } from "../../domain/contratos/iInserirUsuario"
import { IValidator } from "../../domain/contratos/iValidator"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import { IInserirUsuarioInputDTO } from "../dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../dtos/iInserirUsuarioOutputDTO"

export default class InserirUsuario implements IInserirUsuario {
  constructor(private usuarioRepository: IUsuarioRepository, private encrypter: IEncrypter, private validator: IValidator<IInserirUsuarioInputDTO>) { }

  async execute(usuario: IInserirUsuarioInputDTO): Promise<IInserirUsuarioOutputDTO> {
    this.validarInputInserirUsuario(usuario)

    const { nome, email, senha, cpf, role } = usuario
    const encryptedPassword = this.encrypter.encryptPassword(senha)
    const newUsuario = new Usuario(nome, email, encryptedPassword, cpf, role)
    const usuarioInserido = await this.usuarioRepository.inserir(newUsuario)
    const outputDTO: IInserirUsuarioOutputDTO = {
      id: usuarioInserido.id,
      nome: usuarioInserido.nome,
      email: usuarioInserido.email.value,
      cpf: usuarioInserido.cpf.value,
      role: usuarioInserido.role,
      criadoEm: usuarioInserido.criadoEm,
    }
    return outputDTO
  }

  private validarInputInserirUsuario(usuario: IInserirUsuarioInputDTO): void {
    if (!this.validator?.object) {
      throw new Error("Validator não foi inicializado corretamente.")
    }
    const schema = this.validator.object({
      nome: this.validator.string().required('Nome é obrigatório'),
      email: this.validator.string().required('Email é obrigatório'),
      senha: this.validator.string().min(8, 'Senha deve ter pelo menos 8 caracteres').required(),
      cpf: this.validator.string().length(11, 'CPF deve ter 11 dígitos').required(),
      role: this.validator.string().required('Role é obrigatória')
    })
    schema.validate(usuario)
  }
}
