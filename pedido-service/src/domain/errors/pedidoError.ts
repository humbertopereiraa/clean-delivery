export default class PedidoError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'PedidoError'
    this.code = code
    Object.setPrototypeOf(this, PedidoError.prototype)
  }
}
