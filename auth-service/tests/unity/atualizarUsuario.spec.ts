import { IUsuarioRepository } from '../../src/domain/repositories/iUsuarioRepository'
import { IEncrypter } from '../../src/domain/contratos/iEncrypter'
import { IValidator } from '../../src/domain/contratos/iValidator'
import { IAtualizarUsuarioInputDTO } from '../../src/aplication/dtos/iAtualizarUsuarioInputDTO'
import { AtualizarUsuario } from '../../src/aplication/usecases/atualizarUsuario'
import Usuario from '../../src/domain/entities/usuario'
import { Role } from '../../src/domain/entities/role'

describe('AtualizarUsuario', () => {
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>
  let encrypterMock: jest.Mocked<IEncrypter>
  let validatorMock: jest.Mocked<IValidator<IAtualizarUsuarioInputDTO>>
  let sut: AtualizarUsuario

  const input: IAtualizarUsuarioInputDTO = {
    id: 'abc123',
    nome: 'Novo Nome',
    email: 'novo@email.com',
    senha: 'novasenha123',
    cpf: '86441440067',
  }

  const usuarioExistente = new Usuario(
    'Antigo Nome',
    'antigo@email.com',
    'senha_antiga',
    '86441440067',
    Role.CLIENTE,
    'abc123',
    new Date('2024-01-01')
  )

  beforeEach(() => {
    usuarioRepositoryMock = {
      buscarPorId: jest.fn(),
      atualizar: jest.fn()
    } as any

    encrypterMock = {
      encryptPassword: jest.fn().mockReturnValue('senha_hash')
    } as any

    validatorMock = {
      object: jest.fn().mockReturnValue({
        validate: jest.fn()
      }),
      string: jest.fn(() => ({
        required: jest.fn(() => ({})),
        min: jest.fn(() => ({
          required: jest.fn(() => ({})),
          optional: jest.fn(() => ({}))
        })),
        length: jest.fn(() => ({
          required: jest.fn(() => ({})),
          optional: jest.fn(() => ({}))
        })),
        email: jest.fn(() => ({
          optional: jest.fn(() => ({}))
        })),
        optional: jest.fn(() => ({}))
      }))
    } as any

    sut = new AtualizarUsuario(usuarioRepositoryMock, encrypterMock, validatorMock)
  })

  it('Deve atualizar o usuário com sucesso: ', async () => {
    usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
    usuarioRepositoryMock.atualizar.mockImplementation((u: Usuario) => {
      Object.assign(u, { atualizadoEm: new Date('2024-02-01') })
      return Promise.resolve(u)
    })

    const result = await sut.execute(input)

    expect(result).toEqual({
      id: 'abc123',
      nome: 'Novo Nome',
      email: 'novo@email.com',
      cpf: '86441440067',
      role: Role.CLIENTE,
      atualizadoEm: new Date('2024-02-01')
    })
    expect(encrypterMock.encryptPassword).toHaveBeenCalledWith('novasenha123')
    expect(usuarioRepositoryMock.atualizar).toHaveBeenCalledWith(expect.any(Usuario))
  })

  it('Deve lançar erro se validator não estiver inicializado corretamente: ', async () => {
    const sutSemValidator = new AtualizarUsuario(usuarioRepositoryMock, encrypterMock, undefined as any)

    await expect(sutSemValidator.execute(input)).rejects.toThrow('Validator não foi inicializado corretamente.')
  })

  it('Deve lançar erro se o input for inválido: ', async () => {
    const validateMock = jest.fn(() => { throw new Error('Dados inválidos') })
    validatorMock.object = jest.fn().mockReturnValue({ validate: validateMock })

    await expect(sut.execute(input)).rejects.toThrow('Dados inválidos')
  })

  it('Deve lançar erro se o usuário não for encontrado: ', async () => {
    usuarioRepositoryMock.buscarPorId.mockResolvedValue(undefined as any)
    await expect(sut.execute(input)).rejects.toThrow('Usuário não encontrado.')
  })

  it('Deve chamar encryptPassword se senha for informada: ', async () => {
    usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
    usuarioRepositoryMock.atualizar.mockResolvedValue(usuarioExistente)

    await sut.execute(input)

    expect(encrypterMock.encryptPassword).toHaveBeenCalledWith(input.senha)
  })

  it('Não deve chamar encryptPassword se senha não for informada: ', async () => {
    const inputSemSenha = { ...input, senha: undefined }
    usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
    usuarioRepositoryMock.atualizar.mockResolvedValue(usuarioExistente)

    await sut.execute(inputSemSenha)

    expect(encrypterMock.encryptPassword).not.toHaveBeenCalled()
  })
})
