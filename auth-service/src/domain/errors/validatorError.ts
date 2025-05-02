export default class ValidatorError extends Error {
  public readonly errors: Array<{ field: string; message: string; code?: string }>

  constructor(errors: Array<{ field: string; message: string; code?: string }>) {
    super('Erro(s) de validação encontrados.')
    this.name = 'ValidatorError'
    this.errors = errors

    // Mantém o stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidatorError)
    }
  }

  static fromZodError(errors: any[]): ValidatorError {
    const formatted = errors.map((error) => ({
      field: error?.path?.[0] ?? '',
      message: error?.message ?? 'A validação falhou.',
      code: error?.code,
    }))
    return new ValidatorError(formatted)
  }
}
