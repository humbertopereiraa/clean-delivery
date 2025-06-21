import { ErrorDomain } from "../../shared/constants"
import { EmailError } from "../errors/emailError"

export default class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(email: string): Email {
    if (!this.isValidEmail(email)) {
      throw new EmailError('Email inválido.', ErrorDomain.E_EMAIL_INVALIDO)
    }
    return new Email(email)
  }

  get value(): string {
    return this._value
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}