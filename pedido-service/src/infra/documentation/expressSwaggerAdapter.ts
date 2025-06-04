import { IRouteDocumentation } from "../../domain/contratos/iRouteDocumentation";
import { IRouteDocumentationEngine } from "../../domain/contratos/iRouteDocumentationEngine"
import swaggerUi from 'swagger-ui-express'

export class ExpressSwaggerAdapter implements IRouteDocumentationEngine {

  private paths: Record<string, any> = {}

  addPath(route: string, method: string, schema: any) {
    this.paths[route] = this.paths[route] || {}
    this.paths[route][method.toLowerCase()] = schema
  }

  async registrar(app: any, doc: IRouteDocumentation): Promise<void> {
    const swaggerDoc = {
      openapi: '3.0.0',
      info: {
        title: doc.getTitulo(),
        version: doc.getVersao(),
        description: doc.getDescricao()
      },
      paths: this.paths
    }
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
  }
}
