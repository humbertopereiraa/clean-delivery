import { connect, Channel, ChannelModel } from 'amqplib'
import { IMensageria } from "../../domain/event/iMensageria"
import { ILogger } from "../../domain/contratos/iLogger"
import { Observable, Subject } from 'rxjs'
import { IEvento } from '../../domain/event/iPayload'
import { IRabbitMQConfiguracao } from './rabbitMQConfig'

export default class RabbitMQAdapter implements IMensageria {

  private static instance: RabbitMQAdapter
  private connection: ChannelModel | null = null
  private channel: Channel | null = null
  private isConnecting: boolean = false
  private isConnected: boolean = false
  private mensagemSubject = new Subject<IEvento>()

  private constructor(private readonly mensageriaConfiguracao: IRabbitMQConfiguracao, private logger: ILogger) {
    if (!this.mensageriaConfiguracao.url) throw new Error('Erro ULR não informada.')
  }

  public static getInstance(mensageriaConfiguracao: IRabbitMQConfiguracao, logger: ILogger): RabbitMQAdapter {
    if (!RabbitMQAdapter.instance) {
      RabbitMQAdapter.instance = new RabbitMQAdapter(mensageriaConfiguracao, logger)
    }
    return RabbitMQAdapter.instance
  }

  public async conectar(maxRetries: number = 5): Promise<void> {
    if (this.isConnecting || this.isConnected) return

    this.isConnecting = true

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        this.connection = await connect(this.mensageriaConfiguracao.url)
        this.channel = await this.connection.createChannel()

        this.monitorarEventosConexao()

        await this.criarExachage()
        await this.criarFila()
        await this.binding()

        this.consumir()

        this.isConnected = true
        this.logger.info('RabbitMQ conectado com sucesso')

        return

      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`Falha ao conectar ao RabbitMQ: ${error instanceof Error ? error.message : String(error)}`)
        }

        this.logger.warn('RabbitMQ indisponível, tentando novamente...')

        const delay = Math.min(1000 * 2 ** attempt, 30000)
        await new Promise(res => setTimeout(res, delay))
      } finally {
        this.isConnecting = false
      }
    }
  }

  public escutarEventos(): Observable<IEvento> {
    return this.mensagemSubject.asObservable()
  }

  public async fechar(): Promise<void> {
    try {
      await this.channel?.close()
      await this.connection?.close()
    } catch (error) {
      this.logger.error('Falha ao fechar conexão', error)
      throw new Error(`Falha ao fechar conexão: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      this.channel = null
      this.connection = null
      this.isConnected = false
      this.isConnecting = false

      this.mensagemSubject.complete()

      RabbitMQAdapter.instance = undefined as any
    }
  }

  private consumir(): void {
    if (!this.channel) throw new Error('Canal RabbitMQ não inicializado')
    this.channel.consume(this.mensageriaConfiguracao.queue, async (msg) => {
      if (msg) {
        const content = msg.content.toString()
        try {
          const routingKey = msg.fields.routingKey
          const payload = JSON.parse(content)
          this.mensagemSubject.next({
            tipo: routingKey as any,
            payload
          })
          this.channel?.ack(msg)
        } catch (error) {
          this.logger.error('Falha ao processar mensagem', error)
          this.channel?.nack(msg, false, false)
        }
      }
    })
  }

  private monitorarEventosConexao(): void {
    this.connection?.on('close', (e: any) => {
      this.logger.warn('Conexão RabbitMQ foi fechada', e)

      this.isConnected = false
      this.channel = null
      this.connection = null


      setTimeout(() => this.conectar(this.mensageriaConfiguracao.retries), 5000)
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
    if (!this.channel) throw new Error('Canal não inicializado')
    await this.channel?.bindQueue(this.mensageriaConfiguracao.queue, this.mensageriaConfiguracao.exchangeName, this.mensageriaConfiguracao.routingKeys)
  }
}