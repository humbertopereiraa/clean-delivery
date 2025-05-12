import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const deletarUsuarioSchema: IRouteDocumentationSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },

  response: {
    200: {
      description: 'Usuário deletado com sucesso',
      type: 'null'
    }
  },

  tags: ['Usuário'],
  summary: 'Remoção de usuário',
  description: 'Remove um usuário do sistema com base no ID fornecido.'
}