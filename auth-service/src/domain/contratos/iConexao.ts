export interface IConexao {
  query(sql: string, parametros?: any[]): Promise<any>
}
