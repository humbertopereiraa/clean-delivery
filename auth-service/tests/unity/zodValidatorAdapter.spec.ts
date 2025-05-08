import ZodValidatorAdapter from "../../src/infra/validators/zodValidatorAdapter"
import ValidatorError from "../../src/domain/errors/validatorError"

describe("ZodValidatorAdapter", () => {

  it("Deve validar comprimento de string corretamente: ", () => {
    const sut = new ZodValidatorAdapter().string().length(5, 'A sequência deve conter exatamente 5 caracteres.')
    expect(() => sut.validate("abcde")).not.toThrow()
    expect(() => sut.validate("abcd")).toThrow(ValidatorError)
  })

  it("Deve lançar erro se length for usado em tipo não string: ", () => {
    expect(() => new ZodValidatorAdapter<number>().length(5)).toThrow("O método length só pode ser utilizado em tipos string.")
  })

  it("Deve validar email corretamente: ", () => {
    const sut = new ZodValidatorAdapter<string>().string().email()
    expect(() => sut.validate("email@teste.com")).not.toThrow()
    expect(() => sut.validate("emailinvalido")).toThrow(ValidatorError)
  })

  it("Deve lançar erro se email for usado em tipo não string: ", () => {
    expect(() => new ZodValidatorAdapter<number>().email()).toThrow("O método email só pode ser utilizado em tipos string.")
  })

  it("Deve validar se campo é obrigatório: ", () => {
    const sut = new ZodValidatorAdapter<string>().required()
    expect(() => sut.validate("valor")).not.toThrow()
    expect(() => sut.validate(undefined as any)).toThrow(ValidatorError)
  })

  it("Deve validar número positivo corretamente: ", () => {
    const sut = new ZodValidatorAdapter<number>().number().positive()
    expect(() => sut.validate(10)).not.toThrow()
    expect(() => sut.validate(-5)).toThrow(ValidatorError)
  })

  it("Deve lançar erro se positive for usado em tipo não number: ", () => {
    expect(() => new ZodValidatorAdapter<string>().positive()).toThrow("O método positive só pode ser utilizado em tipos number.")
  })

  it("Deve validar número negativo corretamente: ", () => {
    const sut = new ZodValidatorAdapter<number>().number().negative()
    expect(() => sut.validate(-10)).not.toThrow()
    expect(() => sut.validate(5)).toThrow(ValidatorError)
  })

  it("Deve lançar erro se negative for usado em tipo não number: ", () => {
    expect(() => new ZodValidatorAdapter<string>().negative()).toThrow("O método negative só pode ser utilizado em tipos number.")
  })

  it("Deve validar data corretamente: ", () => {
    const sut = new ZodValidatorAdapter<string>().string().date()
    expect(() => sut.validate("2024-03-01")).not.toThrow()
  })

  it("Deve lançar erro se date for usado em tipo não string: ", () => {
    expect(() => new ZodValidatorAdapter<number>().date()).toThrow("O método date só pode ser utilizado em tipos string.")
  })

  it("Deve validar datetime corretamente: ", () => {
    const sut = new ZodValidatorAdapter<string>().string().datetime()
    expect(() => sut.validate("2024-03-01T10:00:00Z")).not.toThrow()
  })

  it("Deve lançar erro se datetime for usado em tipo não string: ", () => {
    expect(() => new ZodValidatorAdapter<number>().datetime()).toThrow("O método datetime só pode ser utilizado em tipos string.")
  })

  it("Deve validar se valor é um array: ", () => {
    const sut = new ZodValidatorAdapter<number>().array()
    expect(() => sut.validate([1, 2, 3])).not.toThrow()
    expect(() => sut.validate("não é array" as any)).toThrow(ValidatorError)
  })

  it("Deve validar tamanho mínimo do array: ", () => {
    const sut = new ZodValidatorAdapter<number>().array().minArray(3)
    expect(() => sut.validate([1, 2, 3])).not.toThrow()
    expect(() => sut.validate([1, 2])).toThrow(ValidatorError)
  })

  it("Deve lançar erro se minArray for usado em tipo não array: ", () => {
    expect(() => new ZodValidatorAdapter<number>().minArray(3)).toThrow("O método minArray só pode ser utilizado em tipos array.")
  })

  it("Deve validar tamanho máximo do array: ", () => {
    const sut = new ZodValidatorAdapter<number>().array().maxArray(3)
    expect(() => sut.validate([1, 2, 3])).not.toThrow()
    expect(() => sut.validate([1, 2, 3, 4])).toThrow(ValidatorError)
  })

  it("Deve lançar erro se maxArray for usado em tipo não array: ", () => {
    expect(() => new ZodValidatorAdapter<number>().maxArray(3)).toThrow("O método maxArray só pode ser utilizado em tipos array.")
  })

  it('Deve validar um objeto com os validadores fornecidos: ', () => {
    const zod = new ZodValidatorAdapter()
    const validador = zod.object({
      nome: zod.string().min(2),
      idade: zod.number().positive(),
    })

    const resultado = validador.validate({ nome: 'João', idade: 30 })
    expect(resultado).toEqual({ nome: 'João', idade: 30 })
  })

  it('Deve lançar ValidatorError ao validar um objeto inválido', () => {
    const zod = new ZodValidatorAdapter()
    const validator = zod.object({
      nome: zod.string().min(3),
      idade: zod.number().min(18),
    })

    const dadosInvalidos = {
      nome: 'Jo',
      idade: 15 
    }
    expect(() => validator.validate(dadosInvalidos)).toThrow(ValidatorError)
  })

  it("Deve aceitar um campo opcional como undefined: ", () => {
    const validator = new ZodValidatorAdapter().string().optional()
    expect(() => validator.validate(undefined)).not.toThrow()
  })

  it("Deve validar corretamente um valor quando não for undefined: ", () => {
    const validator = new ZodValidatorAdapter().string().optional()
    expect(validator.validate("teste")).toBe("teste")
  })

  it("Deve lançar erro se o valor não for string (mesmo que seja opcional): ", () => {
    const validator = new ZodValidatorAdapter().string().optional()
    expect(() => validator.validate(123)).toThrow(ValidatorError)
  })
})
