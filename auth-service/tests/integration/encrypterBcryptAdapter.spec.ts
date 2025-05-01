import EncrypterBcryptAdapter from '../../src/infra/crypto/encrypterBcryptAdapter'

jest.mock('../../src/main/configuracao.ts', () => ({
  Configuracao: {
    hash: 10, // valor mockado do saltRounds
  },
}))

describe('EncrypterBcryptAdapter', () => {
  const sut = new EncrypterBcryptAdapter()

  it('Deve gerar uma senha criptografada diferente da original: ', () => {
    const senha = 'minhaSenha123'
    const hash = sut.encryptPassword(senha)

    expect(hash).not.toBe(senha)
    expect(hash.length).toBeGreaterThan(0)
  })

  it('Deve retornar true ao comparar uma senha válida com sua hash: ', async () => {
    const senha = 'minhaSenha123'
    const hash = sut.encryptPassword(senha)

    const resultado = await sut.comparePassword(senha, hash)

    expect(resultado).toBe(true)
  })

  it('Deve retornar false ao comparar uma senha inválida com a hash: ', async () => {
    const senha = 'minhaSenha123'
    const hash = sut.encryptPassword(senha)

    const resultado = await sut.comparePassword('senhaErrada', hash)

    expect(resultado).toBe(false)
  })
})
