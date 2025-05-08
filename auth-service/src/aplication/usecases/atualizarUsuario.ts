import { IAtualizarUsuario } from "../../domain/contratos/iAtualizarUsuario"
import { IEncrypter } from "../../domain/contratos/iEncrypter"
import { IValidator } from "../../domain/contratos/iValidator"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import { IAtualizarUsuarioInputDTO } from "../dtos/iAtualizarUsuarioInputDTO"
import { IAtualizarUsuarioOutputDTO } from "../dtos/iAtualizarUsuarioOutputDTO"

export class AtualizarUsuario implements IAtualizarUsuario {

  constructor(private usuarioRepository: IUsuarioRepository, private encrypter: IEncrypter, private validator: IValidator<IAtualizarUsuarioInputDTO>) { }

  async execute(input: IAtualizarUsuarioInputDTO): Promise<IAtualizarUsuarioOutputDTO> {
    this.validarInput(input)

    const usuarioExistente = await this.usuarioRepository.buscarPorId(input.id)
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.")
    }

    if (input.nome) usuarioExistente.nome = input.nome
    const usuarioAtualizado = new Usuario(
      input?.nome ?? usuarioExistente.nome,
      input?.email ?? usuarioExistente.email.value,
      input?.senha ? this.encrypter.encryptPassword(input.senha) : usuarioExistente.senha,
      input?.cpf ?? usuarioExistente.cpf.value,
      usuarioExistente.role,
      usuarioExistente.id,
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

  private validarInput(input: IAtualizarUsuarioInputDTO): void {
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
