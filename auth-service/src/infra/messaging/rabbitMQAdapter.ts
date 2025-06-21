import { IEvento, ETipoEvento } from "../../domain/event/iEvento"
import { connect, Channel, ChannelModel } from 'amqplib'
import { IMensageria } from "../../domain/event/iMensageria"
import { ILogger } from "../../domain/contratos/iLogger"

export namespace NRabbitMQAdapter {
  export type IConfiguracao = {
    url: string
    exchangeName: string
    exchangeType: string,
    queue: string
    routingKeys: string
  }
}

export default class RabbitMQAdapter implements IMensageria {

  private static instance: RabbitMQAdapter
  private connection: ChannelModel | null = null
  private channel: Channel | null = null
  private isConnecting: boolean = false

  private constructor(private readonly mensageriaConfiguracao: NRabbitMQAdapter.IConfiguracao, private logger: ILogger) {
    if (!this.mensageriaConfiguracao.url) throw new Error('Erro ULR não informada.')
  }

  public static getInstance(mensageriaConfiguracao: NRabbitMQAdapter.IConfiguracao, logger: ILogger): RabbitMQAdapter {
    if (!RabbitMQAdapter.instance) {
      RabbitMQAdapter.instance = new RabbitMQAdapter(mensageriaConfiguracao, logger)
    }
    return RabbitMQAdapter.instance
  }

  public async conectar(): Promise<void> {
    if (this.isConnecting) return
    try {
      this.isConnecting = true
      this.connection = await connect(this.mensageriaConfiguracao.url)
      this.channel = await this.connection.createChannel()

      this.monitorarEventosConexao()
      await this.criarExachage()
      await this.criarFila()
      await this.binding()

    } catch (error) {
      this.isConnecting = false
      throw new Error(`Falha ao conectar ao RabbitMQ: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  public async publicar(tipoEvento: ETipoEvento, evento: IEvento): Promise<boolean> {
    if (!this.channel) {
      this.logger.error('Canal RabbitMQ não inicializado')
      throw new Error('Canal RabbitMQ não inicializado. Chame conectar() antes de publicar.')
    }
    try {
      return this.channel.publish(this.mensageriaConfiguracao.exchangeName, tipoEvento, Buffer.from(JSON.stringify(evento.payload)), { persistent: true })
    } catch (error) {
      this.logger.error('Falha ao publicar mensagem', error)
      throw new Error(`Falha ao publicar mensagem: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  public async fechar(): Promise<void> {
    try {
      await this.channel?.close()
      await this.connection?.close()
    } catch (error) {
      this.logger.error('Falha ao fechar conexão', error)
      throw new Error(`Falha ao fechar conexão: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      this.channel = this.connection = null
      RabbitMQAdapter.instance = undefined as any
    }
  }

  private monitorarEventosConexao(): void {
    this.connection?.on('close', (e: any) => {
      this.logger.warn('Conexão RabbitMQ foi fechada', e)
      setTimeout(() => this.conectar(), 5000)
    })

    this.connection?.on('error', (erro) => {
      this.logger.error('Erro na conexão RabbitMQ', erro)
    })
  }

  private async criarExachage(): Promise<void> {
    await this.channel?.assertExchange(this.mensageriaConfiguracao.exchangeName, this.mensageriaConfiguracao.exchangeType, { durable: true })
  }

  private async criarFila(): Promise<void> {
    await this.channel?.assertQueue(this.mensageriaConfiguracao.queue, {
      durable: true,      // Mensagens persistem após reinício
      exclusive: false,  // Fila pode ser compartilhada
      autoDelete: false  // Não remove fila sem consumidores
    })
  }

  private async binding(): Promise<void> {
    await this.channel?.bindQueue(this.mensageriaConfiguracao.queue, this.mensageriaConfiguracao.exchangeName, this.mensageriaConfiguracao.routingKeys)
  }
}