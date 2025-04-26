import { z } from "zod"

export const validarEnv = (envOrigem: NodeJS.ProcessEnv) => {
  const schema = z.object({
    PRODUCTION: z.string().optional().default("false"),
    APP_NAME: z.string().default("AuthService"),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("1d"),
    HTTP_PORT: z.string().default("3000"),
    BCRYPT_SALT: z.string().default('10')
  })

  const resultado = schema.safeParse(envOrigem)

  if (!resultado.success) {
    console.error("❌ Variáveis de ambiente inválidas:", resultado.error.format())
    process.exit(1)
  }

  return resultado.data
}