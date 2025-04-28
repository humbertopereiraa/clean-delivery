export class UsuarioError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'UsuarioError'
    this.code = code
    Object.setPrototypeOf(this, UsuarioError.prototype)
  }
}
