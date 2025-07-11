import CPF from '../../src/domain/valueObjects/cpf'
import { CpfError } from '../../src/domain/errors/cpfError'

describe('CPF', () => {
  it('Deve criar um objeto CPF válido com um CPF válido: ', () => {
    const cpfValido = '08791159040'
    const sut = CPF.create(cpfValido)
    expect(sut.value).toBe('08791159040')
  })

  it('Deve criar um objeto CPF válido com um CPF formatado: ', () => {
    const cpfFormatado = '087.911.590-40'
    const sut = CPF.create(cpfFormatado)
    expect(sut.value).toBe('08791159040')
  })

  it('Deve lançar um CpfError com a mensagem e o código corretos para um CPF inválido (comprimento): ', () => {
    const cpfInvalido = '1234567890'
    expect(() => CPF.create(cpfInvalido)).toThrow(CpfError)
    expect(() => CPF.create(cpfInvalido)).toThrow('CPF inválido.')
  })

  it('Deve lançar um CpfError para um CPF inválido (todos os dígitos iguais): ', () => {
    const cpfInvalido = '11111111111'
    expect(() => CPF.create(cpfInvalido)).toThrow(CpfError)
  })

  it('Deve lançar um CpfError para um CPF inválido (dígito verificador incorreto - caso 1): ', () => {
    const cpfInvalido = '12345678910'
    expect(() => CPF.create(cpfInvalido)).toThrow(CpfError)
  })

  it('Deve lançar um CpfError para um CPF inválido (dígito verificador incorreto - caso 2): ', () => {
    const cpfInvalido = '98765432101'
    expect(() => CPF.create(cpfInvalido)).toThrow(CpfError)
  })

  it('Deve remover caracteres não numéricos ao criar um CPF: ', () => {
    const cpfComCaracteres = '123-456.789/09'
    const sut = CPF.create(cpfComCaracteres)
    expect(sut.value).toBe('12345678909')
  })
})