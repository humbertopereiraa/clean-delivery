import { IConexao } from "../../domain/contratos/iConexao"
import { Pool } from 'pg'
import { Configuracao } from "../../main/configuracao"

export class PostgresAdapter implements IConexao {

  private readonly pg: Pool
  private static instance: IConexao | null = null

  private constructor() {
    this.pg = new Pool({
      connectionString: Configuracao.banco.stringConexao,
      max: Configuracao.banco.max_pool
    })

    this.pg.on('error', (error: Error,) => {
      // TODO: Logger.error('Erro inesperado no pool de conexões do PostgreSQL:', error);
    })
  }

  public async query(sql: string, parametros?: any[]): Promise<any> {
    try {
      const result = await this.pg.query(sql, parametros)
      return result
    } catch (error: any) {
      //TODO: Logger.error('Erro ao executar a query no PostgreSQL:', error, { query, parameters });
      throw error
    }
  }

  public static getInstance() {
    if (!PostgresAdapter.instance) {
      PostgresAdapter.instance = new PostgresAdapter()
    }
    return PostgresAdapter.instance
  }

}
