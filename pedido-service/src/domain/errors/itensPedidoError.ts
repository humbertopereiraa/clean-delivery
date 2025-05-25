export default class ItensPedidoError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ItensPedidoError'
    this.code = code
    Object.setPrototypeOf(this, ItensPedidoError.prototype)
  }
}
