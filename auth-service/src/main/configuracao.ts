import { validarEnv } from '../infra/validators/env-validator'
import * as dotenv from "dotenv"
dotenv.config()

const env = validarEnv(process.env)

const Configuracao = {
  production: env.PRODUCTION === 'true',
  app: {
    title: env.APP_NAME
  },
  token: {
    chave: env.JWT_SECRET,
    tempoExpiracao: env.JWT_EXPIRES_IN
  },
  hash: env.BCRYPT_SALT,
  http: {
    port: parseInt(env.HTTP_PORT ?? '3000')
  },
}
export { Configuracao }
