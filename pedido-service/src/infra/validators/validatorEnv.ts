import { z } from "zod"
import { IEnvConfig, IValidatorEnv } from "../../domain/contratos/iValidatorEnv"

export default class ValidarEnv implements IValidatorEnv {

  execute(env: NodeJS.ProcessEnv): IEnvConfig {
    const schema = z.object({
      PRODUCTION: z.string().optional().default("false"),
      APP_NAME: z.string().default("PedidoService"),
      HTTP_PORT: z.string().default("3001"),
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