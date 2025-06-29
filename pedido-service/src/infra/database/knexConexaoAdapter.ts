import knex, { Knex } from "knex"
import { IConexao } from "../../domain/contratos/iConexao"
import { parse } from "pg-connection-string"
import { ITransacao } from "../../domain/contratos/iTransacao"
import { Configuracao } from "../../main/configuracao"

export default class KnexConexaoAdapter implements IConexao {

  private readonly conexao: Knex

  constructor() {
    const conexaoObj = parse(Configuracao.banco.stringConexao)
    this.conexao = knex({
      client: "pg",
      connection: {
        host: conexaoObj.host as string,
        port: conexaoObj.port ? parseInt(conexaoObj.port) : 5432,
        user: conexaoObj.user,
        password: conexaoObj.password,
        database: conexaoObj.database as string,
        ssl: false,
      },
      pool: {
        min: 2,
        max: Configuracao.banco.max_pool || 10
      }
    })
  }

  public async transaction(): Promise<ITransacao> {
    const knexTrx = await new Promise<Knex.Transaction>((resolve, reject) => {
      this.conexao.transaction((trx) => {
        resolve(trx)
      }).catch(reject)
    })
    return {
      query: async (sql: string, parametros?: any[]): Promise<any> => {
        try {
          const result = await knexTrx.raw(sql, parametros ?? [])
          return result.rows || result
        } catch (error) {
          throw this.tratarErroBancoDados(error)
        }
      },
      commit: async (): Promise<void> => {
        await knexTrx.commit()
      },
      rollback: async (): Promise<void> => {
        await knexTrx.rollback()
      }
    }
  }

  public async query(sql: string, parametros?: any[]): Promise<any> {
    try {
      const output = await this.conexao.raw(sql, parametros ?? [])
      return output.rows || output
    } catch (error) {
      throw this.tratarErroBancoDados(error)
    }
  }

  public async verificarConexao(): Promise<void> {
    try {
      await this.conexao.raw("SELECT 1")
      console.log('Banco de dados conectado!')
    } catch (error) {
      await this.conexao.destroy()
      throw new Error("Falha com a conexão do banco.")
    }
  }

  private tratarErroBancoDados(error: any): Error {
    return error instanceof Error ? error : new Error("Erro desconhecido no banco de dados.")
  }
}
