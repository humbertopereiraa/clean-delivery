import { IEncrypter } from "../../domain/contratos/iEncrypter"
import { IUsuarioService } from "../../domain/contratos/iUsuarioService"
import { IUuid } from "../../domain/contratos/iUuid"
import { IValidator } from "../../domain/contratos/iValidator"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import { IAtualizarUsuarioInputDTO } from "../dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../dtos/iAtualizarUsuarioOutputDTO"
import { IInserirUsuarioInputDTO } from "../dtos/iInserirUsuarioInputDTO"
import { IInserirUsuarioOutputDTO } from "../dtos/iInserirUsuarioOutputDTO"

export default class UsuarioService implements IUsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository, private encrypter: IEncrypter, private validator: IValidator<IInserirUsuarioInputDTO | IAtualizarUsuarioInputDTO>, private uuid: IUuid) { }

  public async inserir(usuario: IInserirUsuarioInputDTO): Promise<IInserirUsuarioOutputDTO> {
    this.validarInputInserirUsuario(usuario)

    const { nome, email, senha, cpf, role } = usuario
    const encryptedPassword = this.encrypter.encryptPassword(senha)
    const newId = this.uuid.gerar()
    const newUsuario = new Usuario(newId, nome, email, encryptedPassword, cpf, role)
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

  public async atualizar(input: IAtualizarUsuarioInputDTO): Promise<IAtualizarUsuarioOutputDTO> {
    this.validarInputAtualizarUsuario(input)

    const usuarioExistente = await this.usuarioRepository.buscarPorId(input.id)
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.")
    }

    if (input.nome) usuarioExistente.nome = input.nome
    const usuarioAtualizado = new Usuario(
      usuarioExistente.id,
      input?.nome ?? usuarioExistente.nome,
      input?.email ?? usuarioExistente.email.value,
      input?.senha ? this.encrypter.encryptPassword(input.senha) : usuarioExistente.senha,
      input?.cpf ?? usuarioExistente.cpf.value,
      usuarioExistente.role,
      usuarioExistente.criadoEm
    )

    const atualizado = await this.usuarioRepository.atualizar(usuarioAtualizado)

    return {
      id: atualizado.id,
      nome: atualizado.nome,
      email: atualizado.email.value,
      cpf: atualizado.cpf.value,
      role: atualizado.role,
      atualizadoEm: atualizado.atualizadoEm
    }
  }

  public async deletar(id: string): Promise<void> {
    const usuarioExistente = await this.usuarioRepository.buscarPorId(id)
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.")
    }
    await this.usuarioRepository.deletar(id)
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

  private validarInputAtualizarUsuario(input: IAtualizarUsuarioInputDTO): void {
    if (!this.validator?.object) {
      throw new Error("Validator não foi inicializado corretamente.")
    }
    const schema = this.validator.object({
      id: this.validator.string().required('ID é obrigatório'),
      nome: this.validator.string().optional(),
      email: this.validator.string().email('Email inválido').optional(),
      senha: this.validator.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional(),
      cpf: this.validator.string().length(11, 'CPF deve ter 11 dígitos').optional(),
      role: this.validator.string().optional()
    })
    schema.validate(input)
  }
}
