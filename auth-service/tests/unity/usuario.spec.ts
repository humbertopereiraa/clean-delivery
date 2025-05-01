import Usuario from '../../src/domain/entities/usuario'
import { Role } from '../../src/domain/entities/role'
import { UsuarioError } from '../../src/domain/errors/usuarioError'

// Mock da função uuid.gerar para garantir previsibilidade nos testes
jest.mock('../../src/infra/token/uuid.ts', () => ({
  uuid: {
    gerar: jest.fn(() => 'uuid-gerado'),
  },
}))

describe('Usuario', () => {
  let usuarioValido: Usuario

  beforeEach(() => {
    usuarioValido = new Usuario(
      'any_nome',
      'any_email@email.com',
      'any_senha',
      '08791159040',
      Role.CLIENTE
    )
  })

  it('Deve criar um objeto Usuario válido com os dados fornecidos: ', () => {
    expect(usuarioValido.id).toBe('uuid-gerado')
    expect(usuarioValido.nome).toBe('any_nome')
    expect(usuarioValido.email.value).toBe('any_email@email.com')
    expect(usuarioValido.senha).toBe('any_senha')
    expect(usuarioValido.cpf.value).toBe('08791159040')
    expect(usuarioValido.role).toBe(Role.CLIENTE)
    expect(usuarioValido.criadoEm).toBeInstanceOf(Date)
  })

  it('Deve chamar a função validar ao criar um novo Usuario: ', () => {
    const validarSpy = jest.spyOn(Usuario.prototype as any, 'validar')
    new Usuario(
      'any_nome',
      'any_email@email.com',
      'any_senha',
      '08791159040',
      Role.ADMIN
    )
    expect(validarSpy).toHaveBeenCalledTimes(1)
    validarSpy.mockRestore() // Limpa o spy após o teste
  })

  describe('validar', () => {
    it('Não deve lançar erro para um usuário válido: ', () => {
      expect(() => {
        new Usuario(
          'any_nome',
          'any_email@email.com',
          'any_senha',
          '08791159040',
          Role.ADMIN
        )
      }).not.toThrow()
    })

    it('Deve lançar um UsuarioError se o nome for vazio: ', () => {
      const newUsuario = {
        nome: '',
        email: 'any_email@email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: Role.CLIENTE
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow(UsuarioError)
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Nome é obrigatório.')
    })

    it('Deve lançar um UsuarioError se o nome não for uma string: ', () => {
      const newUsuario = {
        nome: 123 as any,
        email: 'any_email@email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: Role.CLIENTE
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow(UsuarioError)
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Nome é obrigatório.')
    })

    it('Deve lançar um UsuarioError se o role for inválido: ', () => {
      const newUsuario = {
        nome: 'any_nome',
        email: 'any_email@email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: 'any_role' as any
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow(UsuarioError)
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Campo role inválido.')
    })

    it('Deve lançar um UsuarioError se o email for inválido: ', () => {
      const newUsuario = {
        nome: 'any_nome',
        email: 'any_email_email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: Role.ENTREGADOR
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Email inválido.')
    })

    it('Deve lançar um UsuarioError se o CPF for inválido: ', () => {
      const newUsuario = {
        nome: 'any_nome',
        email: 'any_email@email.com',
        senha: 'any_senha',
        cpf: '11111111111',
        role: Role.ADMIN
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('CPF inválido.')
    })

    it('Deve lançar um UsuarioError se o email passar de 255 caracteres: ', () => {
      const newUsuario = {
        nome: 'any_nome',
        email: 'any_emailaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: Role.ADMIN
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow(UsuarioError)
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Campo email deve ter no máximo 255 caracteres.')
    })

    it('Deve lançar um UsuarioError se o nome passar de 150 caracteres: ', () => {
      const newUsuario = {
        nome: 'any_nomeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        email: 'any_email@email.com',
        senha: 'any_senha',
        cpf: '08791159040',
        role: Role.ADMIN
      }
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow(UsuarioError)
      expect(() => { new Usuario(newUsuario.nome, newUsuario.email, newUsuario.senha, newUsuario.cpf, newUsuario.role) }).toThrow('Campo nome deve ter no máximo 150 caracteres.')
    })
  })
})