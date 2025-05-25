export default class EnderecoEntregaError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'EnderecoEntregaError'
    this.code = code
    Object.setPrototypeOf(this, EnderecoEntregaError.prototype)
  }
}
