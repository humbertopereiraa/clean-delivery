export default class ValidatorError extends Error {
  public readonly errors: Array<{ field: string; message: string; code?: string }>
  
  constructor(errors: Array<{ field: string; message: string; code?: string }>) {
    const message = errors.map(e => `${e.field ? e.field + ': ' : ''}${e.message}`).join('; ')
    super(message || 'Erro(s) de validação encontrados.')
    this.name = 'ValidatorError'
    this.errors = errors
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidatorError)
    }
  }

  static fromZodError(errors: any[]): ValidatorError {
    const errosFormatado = errors.map((error) => ({
      field: error?.path?.join('.') ?? '',
      message: error?.message ?? 'A validação falhou.',
      code: error?.code,
    }))
    return new ValidatorError(errosFormatado)
  }
}
