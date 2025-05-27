export interface ITransacao {
  query(sql: string, parametros?: any[]): Promise<any>
  commit(): Promise<void>
  rollback(): Promise<void>
}
