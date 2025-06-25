
import * as dotenv from "dotenv"
import ValidarEnv from "../infra/validators/validatorEnv"
dotenv.config()

const validarEnv = new ValidarEnv()
const env = validarEnv.execute(process.env)

const Configuracao = {
  production: env.PRODUCTION === 'true',
  app: {
    title: env.APP_NAME
  },
  http: {
    port: parseInt(env.HTTP_PORT)
  },
  banco: {
    stringConexao: env.DATABASE_URL,
    max_pool: parseInt(env.DATABASE_MAX_POOL)
  },
  banco_cache: {
    url: env.DATABASE_CACHE_URL
  },
  mensageria: {
    rabbitmq: {
      url: env.RABBITMQ_URL,
      exchangeName: env.RABBITMQ_EXCHANGENAME,
      exchangeType: env.RABBITMQ_EXCHANGETYPE,
      queue: env.RABBITMQ_QUEUE,
      routingKeys: env.RABBITMQ_ROUTING_KEY
    }
  }
}
export { Configuracao }
