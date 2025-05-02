export interface IValidator<T> {
  validate(data: unknown): T
  string(message?: string): IValidator<string>
  number(message?: string): IValidator<number>
  boolean(message?: string): IValidator<boolean>
  max(value: number, message?: string): IValidator<T>
  min(value: number, message?: string): IValidator<T>
  length(value: number, message?: string): IValidator<T>
  email(message?: string): IValidator<T>
  required(message?: string): IValidator<T>
  object?<U extends Record<string, IValidator<any>>>(shape: U): IValidator<{ [K in keyof U]: U[K] extends IValidator<infer R> ? R : never }>
  positive(): IValidator<T>
  negative(): IValidator<T>
  date(message?: string): IValidator<T>
  datetime(): IValidator<T>
  array(): IValidator<T[]>
  minArray(length: number, message?: string): IValidator<T[]>
  maxArray(length: number, message?: string): IValidator<T[]>
}