import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const atualizarUsuarioSchema: IRouteDocumentationSchema = {
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      nome: { type: 'string', example: 'any_nome' },
      email: { type: 'string', format: 'email' },
      senha: { type: 'string', minLength: 8, example: 'any_senha' },
      cpf: { type: 'string', minLength: 11, example: '78999541002' }
    }
  },

  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        nome: { type: 'string', example: 'any_nome' },
        email: { type: 'string', format: 'email' },
        cpf: { type: 'string', example: '78999541002' },
        role: { type: 'string', enum: ['cliente', 'entregador', 'admin'], example: 'cliente' },
        atualizadoEm: { type: 'string', format: 'date-time' }
      }
    }
  },

  tags: ['Usuário'],
  summary: 'Atualização de usuário',
  description: 'Atualiza os dados de um usuário existente'
}
