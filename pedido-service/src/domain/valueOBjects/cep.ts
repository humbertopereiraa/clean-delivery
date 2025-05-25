import { ErrorDomain } from "../../shared/constants"
import CepError from "../errors/cepError"

export default class CEP {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  public static create(cep: string): CEP {
    if (!CEP.isValidCEP(cep)) {
      throw new CepError('Cep inválido', ErrorDomain.E_CEP_INVALIDO)
    }
    return new CEP(cep)
  }

  get value(): string {
    return this._value
  }

  private static isValidCEP(cep: string): boolean {
    return /^[0-9]{2}\.[0-9]{3}-[0-9]{3}$/.test(cep)
  }
}

