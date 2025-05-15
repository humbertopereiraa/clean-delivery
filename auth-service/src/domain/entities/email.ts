import { ErrorDomain } from "../../shared/constants"
import { EmailError } from "../errors/emailError"

export default class Email {
  private readonly _value: string

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new EmailError('Email inválido.', ErrorDomain.E_EMAIL_INVALIDO)
    }
    this._value = value
  }

  get value(): string {
    return this._value
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}