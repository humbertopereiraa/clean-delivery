export interface IDomainErrorStatusResolver {
  getStatusCodeHttp(code: string): number
}
