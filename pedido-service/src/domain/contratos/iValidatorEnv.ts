
export interface IEnvConfig {
  PRODUCTION: string
  APP_NAME: string
  HTTP_PORT: string
  DATABASE_URL: string,
  DATABASE_MAX_POOL: string
}

export interface IValidatorEnv {
  execute(env: NodeJS.ProcessEnv): IEnvConfig
}