import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { IRouteDocumentation } from '../../domain/contratos/iRouteDocumentation'
import { IRouteDocumentationEngine } from '../../domain/contratos/iRouteDocumentationEngine'

export default class FastifySwaggerAdapter implements IRouteDocumentationEngine<FastifyInstance, IRouteDocumentation> {
  async registrar(app: FastifyInstance, documentacao: IRouteDocumentation): Promise<void> {
    const config = this.toSwagger(documentacao)
    await app.register(fastifySwagger, { swagger: config })
    await app.register(fastifySwaggerUI, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      }
    })
  }

  private toSwagger(doc: IRouteDocumentation): any {
    return {
      info: {
        title: doc.getTitulo(),
        version: doc.getVersao(),
        description: doc.getDescricao()
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Rotas de autenticação' }
      ]
    };
  }
}
