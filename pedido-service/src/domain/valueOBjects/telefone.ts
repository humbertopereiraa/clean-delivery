import { ErrorDomain } from "../../shared/constants"
import TelefoneError from "../errors/telefoneError"

export default class Telefone {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(telefone: string): Telefone {
    if (!Telefone.isValidTelefone(telefone)) {
      throw new TelefoneError(telefone, ErrorDomain.E_TELEFONE_INVALIDO)
    }
    return new Telefone(telefone)
  }

  get value(): string {
    return this._value
  }

  private static isValidTelefone(cep: string): boolean {
    return /^\d{11}$/.test(cep)
  }
}
