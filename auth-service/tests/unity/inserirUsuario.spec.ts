import { IUsuarioRepository } from '../../src/domain/repositories/iUsuarioRepository'
import { IEncrypter } from '../../src/domain/contratos/iEncrypter'
import { IValidator } from '../../src/domain/contratos/iValidator'
import { IInserirUsuarioInputDTO } from '../../src/aplication/dtos/iInserirUsuarioInputDTO'
import InserirUsuario from '../../src/aplication/usecases/inserirUsuario'
import { Role } from '../../src/domain/entities/role'
import Usuario from '../../src/domain/entities/usuario'

describe('InserirUsuario', () => {
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>
  let encrypterMock: jest.Mocked<IEncrypter>
  let validatorMock: jest.Mocked<IValidator<IInserirUsuarioInputDTO>>
  let sut: InserirUsuario

  const input: IInserirUsuarioInputDTO = {
    nome: 'any_name',
    email: 'anu_email@email.com',
    senha: '12345678',
    cpf: '08791159040',
    role: Role.CLIENTE
  }

  beforeEach(() => {
    usuarioRepositoryMock = {
      inserir: jest.fn()
    } as any

    encrypterMock = {
      encryptPassword: jest.fn().mockReturnValue('hashed_password')
    } as any

    validatorMock = {
      object: jest.fn().mockReturnValue({
        validate: jest.fn()
      }),
      string: jest.fn(() => ({
        required: jest.fn(() => ({
          min: jest.fn(() => ({})),
          length: jest.fn(() => ({}))
        })),
        min: jest.fn(() => ({
          required: jest.fn(() => ({}))
        })),
        length: jest.fn(() => ({
          required: jest.fn(() => ({}))
        }))
      }))
    } as any

    sut = new InserirUsuario(usuarioRepositoryMock, encrypterMock, validatorMock)
  })

  it('Deve inserir o usuário com sucesso: ', async () => {
    const fakeUsuario = new Usuario(
      input.nome,
      input.email,
      'hashed_password',
      input.cpf,
      input.role
    )
    Object.assign(fakeUsuario, { id: 'abc123', criadoEm: new Date('2024-01-01') })

    usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

    const result = await sut.execute(input)

    expect(result).toEqual({
      id: 'abc123',
      nome: input.nome,
      email: input.email,
      cpf: input.cpf,
      role: input.role,
      criadoEm: new Date('2024-01-01')
    })
    expect(encrypterMock.encryptPassword).toHaveBeenCalledWith(input.senha)
    expect(usuarioRepositoryMock.inserir).toHaveBeenCalled()
  })

  it('Deve lançar erro se validator não estiver inicializado: ', async () => {
    const sutSemValidator = new InserirUsuario(usuarioRepositoryMock, encrypterMock, undefined as any)

    await expect(() => sutSemValidator.execute(input)).rejects.toThrow('Validator não foi inicializado corretamente.')
  })

  it('Deve lançar erro se o input for inválido: ', async () => {
    const validateMock = jest.fn(() => { throw new Error('Dados inválidos') })
    validatorMock.object = jest.fn().mockReturnValue({ validate: validateMock })

    await expect(sut.execute(input)).rejects.toThrow('Dados inválidos')
  })

  it('Deve chamar encryptPassword com a senha correta: ', async () => {
    const fakeUsuario = new Usuario(
      input.nome,
      input.email,
      'hashed_password',
      input.cpf,
      input.role
    )
    Object.assign(fakeUsuario, { id: 'id', criadoEm: new Date() })
    usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

    await sut.execute(input)

    expect(encrypterMock.encryptPassword).toHaveBeenCalledWith(input.senha)
  })

  it('Deve chamar usuarioRepository.inserir com instância de Usuario: ', async () => {
    const fakeUsuario = new Usuario(
      input.nome,
      input.email,
      'hashed_password',
      input.cpf,
      input.role
    )
    Object.assign(fakeUsuario, { id: 'id', criadoEm: new Date() })
    usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

    const spy = jest.spyOn(usuarioRepositoryMock, 'inserir')

    await sut.execute(input)

    expect(spy).toHaveBeenCalledWith(expect.any(Usuario))
  })
})
