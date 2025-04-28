export class EmailError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'EmailError'
    this.code = code
    Object.setPrototypeOf(this, EmailError.prototype)
  }
}
