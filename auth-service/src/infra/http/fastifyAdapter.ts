import HttpServer from "../../domain/abstracoes/aHttp"
import fastify, { FastifyInstance } from "fastify"
import helmet from '@fastify/helmet'
import { StatusCode } from "../../utils/statusCode"
import { IRouteDocumentation } from "../../domain/contratos/iRouteDocumentation"
import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"
import { IRouteDocumentationEngine } from "../../domain/contratos/iRouteDocumentationEngine"

export class FastifyAdapter extends HttpServer {

  public app: FastifyInstance

  constructor() {
    super()
    this.app = fastify({
      ajv: {
        customOptions: {
          keywords: ['example']
        }
      }
    })
    this.config()
  }

  on(url: string, metodo: "get" | "post" | "put" | "delete", fn: (req: any) => any, schema?: IRouteDocumentationSchema) {
    this.app[metodo](url, { schema: this.mapSchema(schema) }, async (req: any, reply: any) => {
      try {
        const output = await fn(req)
        return reply.code(StatusCode.OK).send(output)
      } catch (error) {
        return reply.code(StatusCode.SERVER_ERROR).send(error)
      }
    })
  }

  async listen(porta: number): Promise<void> {
    await this.app.listen({ port: porta })
    console.log(`[Auth Service] Servidor rodando na porta ${porta}`)
  }

  async configuraDocumentacaoRotas(routeDocumentationEngine: IRouteDocumentationEngine, routeDocumentantion: IRouteDocumentation) {
    await routeDocumentationEngine.registrar(this.app, routeDocumentantion)
  }

  //TODO: middleware para tratar erros mapeados (adicionar status code http de acordo com esses erros)

  private async config(): Promise<void> {
    this.app.register(helmet) // Middleware Helmet
  }

  private mapSchema(schema?: IRouteDocumentationSchema): any {
    if (!schema) return undefined
    const mapped: any = {}
    if (schema.body) mapped.body = schema.body
    if (schema.querystring) mapped.querystring = schema.querystring
    if (schema.params) mapped.params = schema.params
    if (schema.headers) mapped.headers = schema.headers
    if (schema.response) mapped.response = schema.response
    if (schema.tags) mapped.tags = schema.tags
    if (schema.summary) mapped.summary = schema.summary
    if (schema.description) mapped.description = schema.description
    return mapped
  }
}
