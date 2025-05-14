import { IAtualizarUsuarioInputDTO } from '../../src/aplication/dtos/iAtualizarUsuarioInputDTO'
import { IInserirUsuarioInputDTO } from '../../src/aplication/dtos/iInserirUsuarioInputDTO'
import UsuarioService from '../../src/aplication/service/usuarioService'
import { IEncrypter } from '../../src/domain/contratos/iEncrypter'
import { IValidator } from '../../src/domain/contratos/iValidator'
import { Role } from '../../src/domain/entities/role'
import Usuario from '../../src/domain/entities/usuario'
import { IUsuarioRepository } from '../../src/domain/repositories/iUsuarioRepository'

describe('UsuarioService', () => {
  let sut: UsuarioService
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>
  let encrypterMock: jest.Mocked<IEncrypter>
  let validatorMock: jest.Mocked<IValidator<IInserirUsuarioInputDTO | IAtualizarUsuarioInputDTO>>

  beforeEach(() => {
    usuarioRepositoryMock = {
      inserir: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
    }

    encrypterMock = {
      encryptPassword: jest.fn().mockReturnValue('senha_hash'),
      comparePassword: jest.fn(),
    }

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

    sut = new UsuarioService(usuarioRepositoryMock, encrypterMock, validatorMock)
  })

  describe('InserirUsuario: ', () => {
    const input: IInserirUsuarioInputDTO = {
      nome: 'any_name',
      email: 'anu_email@email.com',
      senha: '12345678',
      cpf: '08791159040',
      role: Role.CLIENTE
    }

    it('Deve inserir o usuário com sucesso: ', async () => {
      const fakeUsuario = new Usuario(
        input.nome,
        input.email,
        'senha_hash',
        input.cpf,
        input.role
      )
      Object.assign(fakeUsuario, { id: 'abc123', criadoEm: new Date('2024-01-01') })

      usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

      const result = await sut.inserir(input)

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
      const sutSemValidator = new UsuarioService(usuarioRepositoryMock, encrypterMock, undefined as any)
      await expect(() => sutSemValidator.inserir(input)).rejects.toThrow('Validator não foi inicializado corretamente.')
    })

    it('Deve lançar erro se o input for inválido: ', async () => {
      const validateMock = jest.fn(() => { throw new Error('Dados inválidos') })
      validatorMock.object = jest.fn().mockReturnValue({ validate: validateMock })
      await expect(sut.inserir(input)).rejects.toThrow('Dados inválidos')
    })

    it('Deve chamar encryptPassword com a senha correta: ', async () => {
      const fakeUsuario = new Usuario(
        input.nome,
        input.email,
        'senha_hash',
        input.cpf,
        input.role
      )
      Object.assign(fakeUsuario, { id: 'id', criadoEm: new Date() })
      usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

      await sut.inserir(input)
      expect(encrypterMock.encryptPassword).toHaveBeenCalledWith(input.senha)
    })

    it('Deve chamar usuarioRepository.inserir com instância de Usuario: ', async () => {
      const fakeUsuario = new Usuario(
        input.nome,
        input.email,
        'senha_hash',
        input.cpf,
        input.role
      )
      Object.assign(fakeUsuario, { id: 'id', criadoEm: new Date() })
      usuarioRepositoryMock.inserir.mockResolvedValue(fakeUsuario)

      const spy = jest.spyOn(usuarioRepositoryMock, 'inserir')
      await sut.inserir(input)
      expect(spy).toHaveBeenCalledWith(expect.any(Usuario))
    })
  })

  describe('AtualizarUsuario: ', () => {
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

    it('Deve atualizar o usuário com sucesso: ', async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
      usuarioRepositoryMock.atualizar.mockImplementation((u: Usuario) => {
        Object.assign(u, { atualizadoEm: new Date('2024-02-01') })
        return Promise.resolve(u)
      })

      const result = await sut.atualizar(input)

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
      const sutSemValidator = new UsuarioService(usuarioRepositoryMock, encrypterMock, undefined as any)
      await expect(sutSemValidator.atualizar(input)).rejects.toThrow('Validator não foi inicializado corretamente.')
    })

    it('Deve lançar erro se o input for inválido: ', async () => {
      const validateMock = jest.fn(() => { throw new Error('Dados inválidos') })
      validatorMock.object = jest.fn().mockReturnValue({ validate: validateMock })
      await expect(sut.atualizar(input)).rejects.toThrow('Dados inválidos')
    })

    it('Deve lançar erro se o usuário não for encontrado: ', async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(undefined as any)
      await expect(sut.atualizar(input)).rejects.toThrow('Usuário não encontrado.')
    })

    it('Deve chamar encryptPassword se senha for informada: ', async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
      usuarioRepositoryMock.atualizar.mockResolvedValue(usuarioExistente)
      await sut.atualizar(input)
      expect(encrypterMock.encryptPassword).toHaveBeenCalledWith(input.senha)
    })

    it('Não deve chamar encryptPassword se senha não for informada: ', async () => {
      const inputSemSenha = { ...input, senha: undefined }
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(usuarioExistente)
      usuarioRepositoryMock.atualizar.mockResolvedValue(usuarioExistente)
      await sut.atualizar(inputSemSenha)
      expect(encrypterMock.encryptPassword).not.toHaveBeenCalled()
    })
  })

  describe('DeletarUsuario: ', () => {
    it('Deve deletar o usuário se ele existir: ', async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue({ id: '123', nome: 'Test' } as Usuario)
      usuarioRepositoryMock.deletar.mockResolvedValue()
      await expect(sut.deletar('123')).resolves.toBeUndefined()
      expect(usuarioRepositoryMock.buscarPorId).toHaveBeenCalledWith('123')
      expect(usuarioRepositoryMock.deletar).toHaveBeenCalledWith('123')
    })

    it('Deve lançar erro se o usuário não for encontrado: ', async () => {
      usuarioRepositoryMock.buscarPorId.mockResolvedValue(undefined as any)
      await expect(sut.deletar('123')).rejects.toThrow('Usuário não encontrado.')

      expect(usuarioRepositoryMock.buscarPorId).toHaveBeenCalledWith('123')
      expect(usuarioRepositoryMock.deletar).not.toHaveBeenCalled()
    })
  })
})