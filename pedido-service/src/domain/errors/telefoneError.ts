export default class TelefoneError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'TelefoneError'
    this.code = code
    Object.setPrototypeOf(this, TelefoneError.prototype)
  }
}
