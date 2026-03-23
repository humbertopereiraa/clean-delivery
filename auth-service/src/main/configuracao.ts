
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
  token: {
    chave: env.JWT_SECRET,
    tempoExpiracao: env.JWT_EXPIRES_IN
  },
  hash: parseInt(env.BCRYPT_SALT),
  http: {
    port: parseInt(env.HTTP_PORT)
  },
  banco: {
    stringConexao: env.DATABASE_URL,
    max_pool: parseInt(env.DATABASE_MAX_POOL)
  },
  mensageria: {
    rabbitmq: {
      url: env.RABBITMQ_URL,
      exchangeName: env.RABBITMQ_EXCHANGE_NAME,
      exchangeType: env.RABBITMQ_EXCHANGE_TYPE,
      queue: env.RABBITMQ_QUEUE,
      routingKeys: env.RABBITMQ_ROUTING_KEY,
      retries: parseInt(env.RABBITMQ_RETRIES_CONNECT),
    }
  }
}
export { Configuracao }
