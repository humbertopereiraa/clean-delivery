import { z } from "zod"
import { EnvConfig, IValidatorEnv } from "../../domain/contratos/iValidatorEnv"

export default class ValidarEnv implements IValidatorEnv {

  execute(env: NodeJS.ProcessEnv): EnvConfig {
    const schema = z.object({
      PRODUCTION: z.string().optional().default("false"),
      APP_NAME: z.string().default("AuthService"),
      JWT_SECRET: z.string(),
      JWT_EXPIRES_IN: z.string().default("1d"),
      HTTP_PORT: z.string().default("3000"),
      BCRYPT_SALT: z.string().default('10'),
      DATABASE_URL: z.string(),
      DATABASE_MAX_POOL: z.string().default('10')
    })

    const resultado = schema.safeParse(env)

    if (!resultado.success) {
      console.error("❌ Erro na validação das variáveis de ambiente. Verifique o arquivo .env: ", resultado.error.format())
      process.exit(1)
    }

    return resultado.data
  }
}