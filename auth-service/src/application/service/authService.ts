import { IAuthService } from "../../domain/contratos/iAuthService"
import { IEncrypter } from "../../domain/contratos/iEncrypter"
import { IToken } from "../../domain/contratos/iToken"
import { IValidator } from "../../domain/contratos/iValidator"
import { Role } from "../../domain/entities/role"
import Usuario from "../../domain/entities/usuario"
import { AutenticacaoError } from "../../domain/errors/autenticacaoError"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"
import { ErrorDomain } from "../../shared/constants"
import { IAutenticacaoInputDTO } from "../dtos/iAutenticacaoInputDTO"
import { IAutenticacaoOutputDTO } from "../dtos/iAutenticacaoOutputDTO"

export default class AuthService implements IAuthService {

  constructor(private usuarioRepository: IUsuarioRepository, private encrypter: IEncrypter,
    private tokenProvider: IToken, private chaveToken: string,
    private validator: IValidator<IAutenticacaoInputDTO>) {
  }

  public async autenticar(input: IAutenticacaoInputDTO): Promise<IAutenticacaoOutputDTO> {
    this.validarInputAutenticacao(input)
    const { email, senha } = input
    const usuario = await this.validarCredenciais(email, senha)

    const token = await this.tokenProvider.gerar({ id: usuario.id, role: usuario.role }, this.chaveToken)
    return {
      token,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email.value,
      cpf: usuario.cpf.value,
      role: usuario.role as Role
    }
  }

  private async validarCredenciais(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorEmail(email)
    const senhaValida = usuario && await this.encrypter.comparePassword(senha, usuario.senha)
    if (!senhaValida) {
      throw new AutenticacaoError("Falha na autenticação. Verifique seu email e senha.", ErrorDomain.E_AUTENTICACAO_INVALIDA)
    }
    return usuario
  }

  private validarInputAutenticacao(input: IAutenticacaoInputDTO): void {
    if (!this.validator?.object) {
      throw new Error("Validator não foi inicializado corretamente.")
    }
    const schema = this.validator.object({
      email: this.validator.string().min(1, 'Email é obrigatório').email('Email inválido'),
      senha: this.validator.string().min(1, 'Senha é obrigatória'),
    })
    schema.validate(input)
  }
}
