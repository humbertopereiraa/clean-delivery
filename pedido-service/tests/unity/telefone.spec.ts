import TelefoneError from '../../src/domain/errors/telefoneError'
import Telefone from '../../src/domain/valueOBjects/telefone'

describe('Telefone', () => {

  it('Deve criar uma instância de Telefone válido: ', () => {
    const telefoneValido = '27999999999'
    const sut = Telefone.create(telefoneValido)
    expect(sut).toBeInstanceOf(Telefone)
    expect(sut.value).toBe(telefoneValido)
  })

  it('Deve retornar o valor correto do telefone através do get: ', () => {
    const telefoneValido = '27999999999'
    const sut = Telefone.create(telefoneValido)
    expect(sut.value).toBe(telefoneValido)
  })

  it('Deve lançar TelefoneError para um telefone com menos de 11 dígitos: ', () => {
    const telefoneInvalido = '123456789'
    expect(() => Telefone.create(telefoneInvalido)).toThrow(TelefoneError)
  })

  it('Deve lançar TelefoneError para um telefone com mais de 11 dígitos: ', () => {
    const telefoneInvalido = '123456789012'
    expect(() => Telefone.create(telefoneInvalido)).toThrow(TelefoneError)
  })

  it('Deve lançar TelefoneError para um telefone com caracteres não numéricos: ', () => {
    const telefoneInvalido = '11a22334455'
    expect(() => Telefone.create(telefoneInvalido)).toThrow(TelefoneError)
  })

  it('Deve lançar TelefoneError para uma string com apenas espaços: ', () => {
    const telefoneInvalido = '           '
    expect(() => Telefone.create(telefoneInvalido)).toThrow(TelefoneError)
  })

  it('Deve lançar TelefoneError para entrada nula, indefinida ou vazia: ', () => {
    expect(() => Telefone.create(null as any)).toThrow(TelefoneError)
    expect(() => Telefone.create(undefined as any)).toThrow(TelefoneError)
    expect(() => Telefone.create('')).toThrow(TelefoneError)
  })

  it('Deve retornar o valor correto do Telefone através do get: ', () => {
    const telefoneValido = '27999999999'
    const sut = Telefone.create(telefoneValido)
    expect(sut.value).toBe(telefoneValido)
  })
})