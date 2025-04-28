export class CpfError extends Error {
  public readonly code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'CpfError'
    this.code = code
    Object.setPrototypeOf(this, CpfError.prototype)
  }
}
