
export interface IEnvConfig {
  PRODUCTION: string
  APP_NAME: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  HTTP_PORT: string
  BCRYPT_SALT: string,
  DATABASE_URL: string,
  DATABASE_MAX_POOL: string
}

export interface IValidatorEnv {
  execute(env: NodeJS.ProcessEnv): IEnvConfig
}