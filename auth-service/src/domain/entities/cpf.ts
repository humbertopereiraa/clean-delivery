import { E_CPF_INVALIDO } from "../../shared/constants"
import { CpfError } from "../errors/cpfError"

export default class CPF {
  private readonly _value: string

  constructor(value: string) {
    const cleanedValue = value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (!this.isValidCPF(cleanedValue)) {
      throw new CpfError('CPF inválido.', E_CPF_INVALIDO)
    }
    this._value = cleanedValue
  }

  get value(): string {
    return this._value
  }

  private isValidCPF(cpf: string): boolean {

    if (cpf.length !== 11) return false

    // Verifica se todos os dígitos são iguais (CPFs como 111.111.111-11 são inválidos)
    if (cpf.split('').every(digit => digit === cpf[0])) return false

    const numbers = cpf.split('').map(Number)
    let sum = 0
    let remainder: number

    // Validação do primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
      sum += numbers[i] * (10 - i)
    }
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== numbers[9]) return false

    // Validação do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += numbers[i] * (11 - i)
    }
    remainder = (sum * 10) % 11

    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== numbers[10]) return false

    return true
  }
}
