import { ITransacao } from "./iTransacao"

export interface IConexao {
  verificarConexao(): Promise<void>
  query(sql: string, parametros?: any[]): Promise<any>
  transaction(): Promise<ITransacao>
}
