import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const loginSchema: IRouteDocumentationSchema = {
  body: {
    type: 'object',
    required: ['email', 'senha'],
    properties: {
      email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
      senha: { type: 'string', example: 'minhasenha123' }
    }
  },
  response: {
    200: {
      description: 'Usuário autenticado com sucesso',
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', example: 'e48b9e2b-0c9c-4c4b-b09f-fbe40d08d7b1' },
        nome: { type: 'string', example: 'João da Silva' },
        email: { type: 'string', format: 'email', example: 'usuario@exemplo.com' },
        cpf: { type: 'string', example: '12345678900' },
        role: {
          type: 'string',
          enum: ['cliente', 'entregador', 'admin'],
          example: 'cliente'
        },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    },
    401: {
      description: 'Credenciais inválidas',
      type: 'object',
      properties: {
        mensagem: { type: 'string', example: 'Falha na autenticação. Verifique seu email e senha.' }
      }
    }
  },
  tags: ['Auth'],
  summary: 'Autenticação de usuário',
  description: 'Realiza o login do usuário e retorna o token JWT junto com informações do perfil'
}