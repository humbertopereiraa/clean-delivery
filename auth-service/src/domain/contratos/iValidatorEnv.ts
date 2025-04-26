
export interface EnvConfig {
  PRODUCTION: string
  APP_NAME: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  HTTP_PORT: string
  BCRYPT_SALT: string
}

export interface IValidatorEnv {
  execute(env: NodeJS.ProcessEnv): EnvConfig
}