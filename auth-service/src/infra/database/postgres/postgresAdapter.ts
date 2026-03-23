import { IConexao } from "../../../domain/contratos/iConexao"
import { Pool } from 'pg'
import { Configuracao } from "../../../main/configuracao"
import { ILogger } from "../../../domain/contratos/iLogger"

export class PostgresAdapter implements IConexao {

  private readonly pg: Pool
  private static instance: IConexao | null = null

  private constructor(private readonly logger: ILogger) {
    this.pg = new Pool({
      connectionString: Configuracao.banco.stringConexao,
      max: Configuracao.banco.max_pool,
      ssl: Configuracao.production
    })

    this.pg.on('error', (error: Error,) => {
      this.logger.error(
        'Erro inesperado no pool de conexões do PostgreSQL',
        error
      )
    })
  }

  public async query(sql: string, parametros?: any[]): Promise<any> {
    try {
      const result = await this.pg.query(sql, parametros)
      return result
    } catch (error: any) {
      this.logger.error('Erro ao executar query no PostgreSQL', { sql, parametros, error });
      throw error
    }
  }

  public static getInstance(logger: ILogger) {
    if (!PostgresAdapter.instance) {
      PostgresAdapter.instance = new PostgresAdapter(logger)
    }
    return PostgresAdapter.instance
  }

}
