
export interface IEnvConfig {
  PRODUCTION: string
  APP_NAME: string
  HTTP_PORT: string
  DATABASE_URL: string
  DATABASE_MAX_POOL: string
  DATABASE_CACHE_URL: string
  RABBITMQ_URL: string
  RABBITMQ_EXCHANGENAME: string
  RABBITMQ_EXCHANGETYPE: string
  RABBITMQ_QUEUE: string
  RABBITMQ_ROUTING_KEY: string
  AUTH_SERVICE_URL: string
}

export interface IValidatorEnv {
  execute(env: NodeJS.ProcessEnv): IEnvConfig
}