import { IValidator } from "../../domain/contratos/iValidator"
import { z, ZodArray, ZodError, ZodNumber, ZodRawShape, ZodSchema, ZodString } from "zod"
import ValidatorError from "../../domain/errors/validatorError"

export default class ZodValidatorAdapter<T = any> implements IValidator<T> {
  private schema: ZodSchema<T>

  constructor(schema?: ZodSchema<T>) {
    this.schema = schema || (z.unknown() as ZodSchema<T>)
  }

  validate(data: unknown): T {
    try {
      return this.schema.parse(data)
    } catch (error) {
      if (error instanceof ZodError) throw ValidatorError.fromZodError(error?.errors ?? [])
      throw error
    }
  }

  string(message?: string): IValidator<string> {
    return new ZodValidatorAdapter<string>(z.string({ invalid_type_error: message ?? "O campo deve ser uma string." }))
  }

  number(message?: string): IValidator<number> {
    return new ZodValidatorAdapter<number>(z.number({ invalid_type_error: message ?? "O campo deve ser um número." }))
  }

  boolean(message?: string): IValidator<boolean> {
    return new ZodValidatorAdapter<boolean>(z.boolean({ invalid_type_error: message ?? "O campo deve ser um boolean." }))
  }

  max(value: number, message?: string): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.max(value, { message }) as unknown as ZodSchema<T>)
    else if (this.schema instanceof ZodNumber) return new ZodValidatorAdapter<T>(this.schema.max(value, { message }) as unknown as ZodSchema<T>)
    throw new Error("O método max só pode ser utilizado em tipos string ou number.")
  }

  min(value: number, message?: string): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.min(value, { message }) as unknown as ZodSchema<T>)
    else if (this.schema instanceof ZodNumber) return new ZodValidatorAdapter<T>(this.schema.min(value, { message }) as unknown as ZodSchema<T>)
    throw new Error("O método min só pode ser utilizado em tipos string ou number.")
  }

  length(value: number, message?: string): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.length(value, { message }) as unknown as ZodSchema<T>)
    throw new Error("O método length só pode ser utilizado em tipos string.")
  }

  email(message?: string): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.email({ message }) as unknown as ZodSchema<T>)
    throw new Error("O método email só pode ser utilizado em tipos string.")
  }

  required() {
    return new ZodValidatorAdapter(this.schema.refine((val: any) => val !== undefined && val !== null, { message: 'Este campo é obrigatório' }))
  }

  object<U extends Record<string, IValidator<any>>>(shape: U): IValidator<{ [K in keyof U]: U[K] extends IValidator<infer R> ? R : never }> {
    const shapeWithSchemas: ZodRawShape = Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [
        key,
        (value as ZodValidatorAdapter<any>).schema,
      ])
    )
    return new ZodValidatorAdapter(z.object(shapeWithSchemas) as ZodSchema<{ [K in keyof U]: U[K] extends IValidator<infer R> ? R : never }>)
  }

  positive(): IValidator<T> {
    if (this.schema instanceof ZodNumber) return new ZodValidatorAdapter<T>(this.schema.positive() as unknown as ZodSchema<T>)
    throw new Error("O método positive só pode ser utilizado em tipos number.")
  }

  negative(): IValidator<T> {
    if (this.schema instanceof ZodNumber) return new ZodValidatorAdapter<T>(this.schema.negative() as unknown as ZodSchema<T>)
    throw new Error("O método negative só pode ser utilizado em tipos number.")
  }

  date(message?: string): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.date(message) as unknown as ZodSchema<T>)
    throw new Error("O método date só pode ser utilizado em tipos string.")
  }

  datetime(): IValidator<T> {
    if (this.schema instanceof ZodString) return new ZodValidatorAdapter<T>(this.schema.datetime() as unknown as ZodSchema<T>)
    throw new Error("O método datetime só pode ser utilizado em tipos string.")
  }

  array(): IValidator<T[]> {
    return new ZodValidatorAdapter<T[]>(this.schema.array() as ZodSchema<T[]>)
  }

  minArray(length: number, message?: string): IValidator<T[]> {
    if (this.schema instanceof ZodArray) return new ZodValidatorAdapter<T[]>(this.schema.min(length, { message }) as ZodSchema<T[]>)
    throw new Error("O método minArray só pode ser utilizado em tipos array.")
  }

  maxArray(length: number, message?: string): IValidator<T[]> {
    if (this.schema instanceof ZodArray) return new ZodValidatorAdapter<T[]>(this.schema.max(length, { message }) as ZodSchema<T[]>)
    throw new Error("O método maxArray só pode ser utilizado em tipos array.")
  }
}
