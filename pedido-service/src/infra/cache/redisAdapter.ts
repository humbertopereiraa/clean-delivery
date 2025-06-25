import { createClient, RedisClientType } from 'redis'
import { ICache } from '../../domain/contratos/iCache'
import { ILogger } from '../../domain/contratos/iLogger'

export default class RedisAdapter implements ICache {
  private static instance: RedisAdapter
  private cliente: RedisClientType

  private constructor(private url: string, private readonly logger: ILogger) {
    this.cliente = createClient({ url })

    this.cliente.on('error', (erro) => {
      this.logger.error('Erro na conexão Redis', erro)
    })
  }

  public static async getInstance(url: string, logger: ILogger): Promise<ICache> {
    if (!RedisAdapter.instance) {
      const adapter = new RedisAdapter(url, logger)
      await adapter.conectar()
      RedisAdapter.instance = adapter
    }
    return RedisAdapter.instance
  }

  private async conectar(): Promise<void> {
    await this.cliente.connect()
    this.logger.info('Conectado ao Redis com sucesso')
  }

  public async obter<T>(chave: string): Promise<T | null> {
    try {
      const valor = await this.cliente.get(chave)
      return valor ? JSON.parse(valor) : null
    } catch (erro) {
      this.logger.error(`Erro ao obter chave "${chave}" do Redis`, erro)
      return null
    }
  }

  public async salvar<T>(chave: string, valor: T, tempoExpiracaoEmSegundos?: number): Promise<void> {
    const valorJSON = JSON.stringify(valor)
    try {
      tempoExpiracaoEmSegundos ? await this.cliente.setEx(chave, tempoExpiracaoEmSegundos, valorJSON) : await this.cliente.set(chave, valorJSON)
    } catch (erro) {
      this.logger.error(`Erro ao salvar chave "${chave}" no Redis`, erro)
    }
  }

  public async deletar(chave: string): Promise<void> {
    try {
      await this.cliente.del(chave)
    } catch (erro) {
      this.logger.error(`Erro ao deletar chave "${chave}" do Redis`, erro)
    }
  }

  public async desconectar(): Promise<void> {
    try {
      await this.cliente.quit()
      this.logger.info('Conexão com Redis encerrada com sucesso')
    } catch (erro) {
      this.logger.error('Erro ao encerrar a conexão com Redis', erro)
    }
  }
}
