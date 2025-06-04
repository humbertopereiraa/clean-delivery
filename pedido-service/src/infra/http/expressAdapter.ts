import HttpServer from "../../domain/abstracoes/aHttp"
import express, { Application, Request, Response } from 'express'
import { IDomainErrorStatusResolver } from "../../domain/contratos/iDomainErrorStatusResolver"
import helmet from "helmet"
import cors from "cors"
import { IRouteDocumentation } from "../../domain/contratos/iRouteDocumentation"
import { IRouteDocumentationEngine } from "../../domain/contratos/iRouteDocumentationEngine"
import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"
import { StatusCode } from "../../utils/statusCode"

export class ExpressAdapter extends HttpServer {

  app: Application
  private routeDocumentationEngine: any

  constructor(protected domainErrorStatusResolver: IDomainErrorStatusResolver) {
    super(domainErrorStatusResolver)
    this.app = express()
    this.config()
  }

  on(url: string, metodo: "get" | "post" | "put" | "delete", fn: (req: any) => any, schema?: IRouteDocumentationSchema): void {
    this.app[metodo](url, async (req: any, res: any) => {
      try {
        const output = await fn(req)
        return res.status(StatusCode.OK).json(output)
      } catch (error: any) {
        const statusCode = this.domainErrorStatusResolver.getStatusCodeHttp(error?.code)
        return res.status(statusCode ?? StatusCode.SERVER_ERROR).json({
          erro: error?.message ?? 'Erro interno no servidor',
          statusCode: statusCode ?? StatusCode.SERVER_ERROR,
        })
      }
    })

    if (this.routeDocumentationEngine && schema) {
      const docPath = this.mapSchemaExpress(schema)
      this.routeDocumentationEngine.addPath(url, metodo, docPath)
    }
  }

  listen(porta: number): void {
    this.app.listen(porta)
    console.log(`Servidor Express rodando na porta: ${porta}`)
  }

  async configurarDocumentacaoRotas(routeDocumentationEngine: IRouteDocumentationEngine, routeDocumentantion: IRouteDocumentation): Promise<void> {
    this.routeDocumentationEngine = routeDocumentationEngine
    this.rotasCarregadas$.subscribe(async (value: boolean) => {
      if (value) await routeDocumentationEngine.registrar(this.app, routeDocumentantion)
    })
  }

  private config(): void {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  private mapSchemaExpress(schema: IRouteDocumentationSchema): any {
    const pathDoc: any = {
      summary: schema.summary,
      description: schema.description,
      tags: schema.tags,
      responses: schema.response,
    }
    if (schema.body) {
      pathDoc.requestBody = {
        content: {
          'application/json': {
            schema: schema.body
          }
        }
      }
    }
    return pathDoc
  }
}
