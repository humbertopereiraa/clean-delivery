import { IAutenticacaoInputDTO } from "../../src/aplication/dtos/iAutenticacaoInputDTO"
import { IEncrypter } from "../../src/domain/contratos/iEncrypter"
import { IToken } from "../../src/domain/contratos/iToken"
import { IValidator } from "../../src/domain/contratos/iValidator"
import { Role } from "../../src/domain/entities/role"
import Usuario from "../../src/domain/entities/usuario"
import { IUsuarioRepository } from "../../src/domain/repositories/iUsuarioRepository"
import { IAuthService } from '../../src/domain/contratos/iAuthService'
import AuthService from "../../src/aplication/service/authService"
import { AutenticacaoError } from "../../src/domain/errors/autenticacaoError"

const makeUsuario = (): Usuario => {
  return new Usuario(
    'any_nome',
    'any_email@email.com',
    'any_senha_hash',
    '41049610008',
    Role.CLIENTE,
  )
}

describe('AuthService', () => {
  let sut: IAuthService
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>
  let encrypterMock: jest.Mocked<IEncrypter>
  let tokenMock: jest.Mocked<IToken>
  let validatorMock: jest.Mocked<IValidator<IAutenticacaoInputDTO>>
  const chaveToken = 'secret-key'

  beforeEach(() => {
    usuarioRepositoryMock = {
      buscarPorEmail: jest.fn()
    } as any

    encrypterMock = {
      comparePassword: jest.fn(),
    } as any

    tokenMock = {
      gerar: jest.fn()
    } as any

    validatorMock = {
      object: jest.fn().mockReturnValue({
        validate: jest.fn()
      }),
      string: jest.fn(() => ({
        min: jest.fn(() => ({
          email: jest.fn(() => ({}))
        }))
      })),
    } as any

    sut = new AuthService(usuarioRepositoryMock, encrypterMock, tokenMock, chaveToken, validatorMock)
  })

  it('Deve autenticar com sucesso: ', async () => {
    const usuario = makeUsuario()
    const input = {
      email: 'any_email@email.com',
      senha: 'any_senha',
    }
    usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(usuario)
    encrypterMock.comparePassword.mockResolvedValue(true)
    tokenMock.gerar.mockResolvedValue('fake-token')

    const result = await sut.autenticar(input)
    expect(result).toEqual({
      token: 'fake-token',
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email.value,
      cpf: usuario.cpf.value,
      role: usuario.role,
    })
  })

  it('Deve lançar erro se o email ou senha forem inválidos: ', async () => {
    const usuario = makeUsuario()
    const input = {
      email: 'any_email123@email.com',
      senha: 'any_senha',
    }
    usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(usuario)
    encrypterMock.comparePassword.mockResolvedValue(false)
    await expect(sut.autenticar(input)).rejects.toThrow(AutenticacaoError)
  })

  it('Deve lançar erro se o validator não for inicializado: ', async () => {
    const authService = new AuthService(usuarioRepositoryMock, encrypterMock, tokenMock, chaveToken, undefined as any)
    const input = {
      email: 'any_email@email.com',
      senha: 'any_senha',
    }
    await expect(authService.autenticar(input)).rejects.toThrow('Validator não foi inicializado corretamente.')
  })

  it('Deve lançar erro se o input for inválido: ', async () => {
    const validateMock = jest.fn(() => { throw new Error('Email é obrigatório') })
    validatorMock.object = jest.fn().mockReturnValue({ validate: validateMock })
    const input = {
      email: '',
      senha: 'any_senha',
    }
    await expect(sut.autenticar(input)).rejects.toThrow('Email é obrigatório')
  })
})