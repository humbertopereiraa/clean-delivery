import winston from "winston"
import { ILogger } from "../../domain/contratos/iLogger"
import { Configuracao } from "../../main/configuracao"

export default class WinstonLoggerAdapter implements ILogger {

  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: Configuracao.production ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    })

    if (!Configuracao.production) {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }))
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta)
  }

  error(message: string, meta?: any): void {
    this.logger.error({ message, stack: meta })
  }
}