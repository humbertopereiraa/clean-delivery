export default class EntregaError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'EntregaError'
    this.code = code
    Object.setPrototypeOf(this, EntregaError.prototype)
  }
}
