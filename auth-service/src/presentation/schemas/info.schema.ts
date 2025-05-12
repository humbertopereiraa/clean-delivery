import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const infoRouteSchema: IRouteDocumentationSchema = {
  response: {
    200: {
      type: 'string',
      example: 'API AUTH SERVICE ATIVO'
    }
  },
  summary: 'Verifica se a API está ativa',
  description: 'Rota simples para confirmar se o serviço de autenticação está online.',
  tags: ['Status']
}
