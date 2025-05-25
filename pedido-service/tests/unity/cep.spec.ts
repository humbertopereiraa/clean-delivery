import CepError from '../../src/domain/errors/cepError'
import CEP from '../../src/domain/valueOBjects/cep'

describe('CEP: ', () => {
  it('Deve criar uma instância de CEP válida com o formato correto: ', () => {
    const cepValido = '12.345-678'
    const sut = CEP.create(cepValido)
    expect(sut).toBeInstanceOf(CEP)
    expect(sut.value).toBe(cepValido)
  })

  it('Deve criar uma instância de CEP válida para vários formatos válidos: ', () => {
    const cep1 = '00.000-000'
    const cep2 = '99.999-999'
    const cep3 = '29.100-000'
    expect(CEP.create(cep1).value).toBe(cep1)
    expect(CEP.create(cep2).value).toBe(cep2)
    expect(CEP.create(cep3).value).toBe(cep3)
  })

  it('Deve lançar CepError para um formato de CEP inválido: ', () => {
    const cepInvalido1 = '12345-678'
    const cepInvalido2 = '12.345678'
    const cepInvalido3 = '1.234-567'
    const cepInvalido4 = '12.3456-789'
    expect(() => CEP.create(cepInvalido1)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido2)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido3)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido4)).toThrow(CepError)
  })

  it('Deve lançar CepError para um CEP com caracteres não numéricos: ', () => {
    const cepInvalido = 'AB.CDE-FGH'
    expect(() => CEP.create(cepInvalido)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido)).toThrow('Cep inválido')
  })

  it('Deve lançar CepError para uma string vazia: ', () => {
    const cepInvalido = ''
    expect(() => CEP.create(cepInvalido)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido)).toThrow('Cep inválido')
  })

  it('Deve lançar CepError para uma string contendo apenas espaços: ', () => {
    const cepInvalido = '   '
    expect(() => CEP.create(cepInvalido)).toThrow(CepError)
    expect(() => CEP.create(cepInvalido)).toThrow('Cep inválido')
  })

  it('Deve lançar CepError para entrada indefinida ou nula: ', () => {
    expect(() => CEP.create(undefined as any)).toThrow(CepError)
    expect(() => CEP.create(null as any)).toThrow('Cep inválido')
    expect(() => CEP.create(undefined as any)).toThrow(CepError)
    expect(() => CEP.create(null as any)).toThrow('Cep inválido')
  })

  it('Deve retornar o valor correto do CEP através do get: ', () => {
    const cepValido = '10.203-400'
    const sut = CEP.create(cepValido)
    expect(sut.value).toBe(cepValido)
  })
})