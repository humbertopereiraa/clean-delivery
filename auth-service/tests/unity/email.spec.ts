import Email from '../../src/domain/valueObjects/email'
import { EmailError } from '../../src/domain/errors/emailError'

describe('Email', () => {
  it('Deve criar um objeto de e-mail válido com um endereço de e-mail válido: ', () => {
    const emailValido = 'email_any@example.com'
    const sut = Email.create(emailValido)
    expect(sut.value).toBe(emailValido)
  })

  it('Deve lançar um EmailError com a mensagem e o código corretos para um endereço de e-mail inválido: ', () =>{
    const emailInvalido = 'emailInvalido'
    expect(() => Email.create(emailInvalido)).toThrow(EmailError)
    expect(() => Email.create(emailInvalido)).toThrow('Email inválido.')
  })

  it('Deve lançar um EmailError para um endereço de email sem o símbolo "@": ', () => {
    const emailInvalido = 'testeexemplo.com'
    expect(() => Email.create(emailInvalido)).toThrow(EmailError)
  })

  it('Deve lançar um EmailError para um endereço de email sem domínio: ', () => {
    const emailInvalido = 'teste@'
    expect(() => Email.create(emailInvalido)).toThrow(EmailError)
  })

  it('Deve lançar um EmailError para um endereço de email sem a parte local: ', () => {
    const emailInvalido = '@exemplo.com'
    expect(() => Email.create(emailInvalido)).toThrow(EmailError)
  })

  it('Deve lançar um EmailError para um endereço de email com espaço em branco: ', () => {
    const emailInvalido = 'teste @exemplo.com'
    expect(() => Email.create(emailInvalido)).toThrow(EmailError)
  })
})