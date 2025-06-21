
export interface IEnvConfig {
  PRODUCTION: string
  APP_NAME: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  HTTP_PORT: string
  BCRYPT_SALT: string,
  DATABASE_URL: string,
  DATABASE_MAX_POOL: string

  RABBITMQ_URL: string,
  RABBITMQ_EXCHANGENAME: string,
  RABBITMQ_EXCHANGETYPE: string,
  RABBITMQ_QUEUE: string,
  RABBITMQ_ROUTING_KEY: string,
}

export interface IValidatorEnv {
  execute(env: NodeJS.ProcessEnv): IEnvConfig
}