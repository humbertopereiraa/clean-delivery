import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const inserirUsuarioSchema: IRouteDocumentationSchema = {
  body: {
    type: 'object',
    required: ['nome', 'email', 'senha', 'cpf', 'role'],
    properties: {
      nome: { type: 'string', example: 'any_nome' },
      email: { type: 'string', format: 'email' },
      senha: { type: 'string', minLength: 8, example: 'any_senha' },
      cpf: { type: 'string', minLength: 11, example: '78999541002' },
      role: { type: 'string', enum: ['cliente', 'entregador', 'admin'] }
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
        criadoEm: { type: 'string', format: 'date-time' }
      }
    }
  },

  tags: ['Usuário'],
  summary: 'Criação de novo usuário',
  description: 'Insere um novo usuário na base de dados'
}