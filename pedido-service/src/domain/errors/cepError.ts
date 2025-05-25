export default class CepError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'CepError'
    this.code = code
    Object.setPrototypeOf(this, CepError.prototype)
  }
}
