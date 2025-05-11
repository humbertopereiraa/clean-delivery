export class AutenticacaoError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'AutenticacaoError'
    this.code = code
    Object.setPrototypeOf(this, AutenticacaoError.prototype)
  }
}
