import { IRouteDocumentationSchema } from "../../domain/contratos/iRouteDocumentationSchema"

export const criarPedidoSchema: IRouteDocumentationSchema = {
  tags: ['Pedidos'],
  summary: 'Criar novo pedido',
  description: 'Cria um pedido com endereço de entrega e itens associados.',
  body: {
    type: 'object',
    required: ['clienteId', 'endereco', 'itens', 'valorEntrega'],
    properties: {
      clienteId: { type: 'string', example: '810f9bd3-4bc5-4a76-b4b5-c801599c70fb' },
      endereco: {
        type: 'object',
        required: [
          'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep',
          'nomeDestinatario', 'telefoneDestinatario'
        ],
        properties: {
          rua: { type: 'string', example: 'Rua Agnelo Guimarães' },
          numero: { type: 'string', example: '123' },
          bairro: { type: 'string', example: 'Três Barras' },
          cidade: { type: 'string', example: 'Linhares' },
          estado: { type: 'string', example: 'ES' },
          cep: { type: 'string', example: '29.907-030' },
          complemento: { type: 'string', example: 'Apto 21' },
          nomeDestinatario: { type: 'string', example: 'João da Silva' },
          telefoneDestinatario: { type: 'string', example: '11912345678' }
        }
      },
      itens: {
        type: 'array',
        items: {
          type: 'object',
          required: ['nome', 'quantidade', 'preco'],
          properties: {
            pedidoId: { type: 'string', example: 'gerado automaticamente' },
            nome: { type: 'string', example: 'Produto A' },
            quantidade: { type: 'number', example: 2 },
            preco: { type: 'number', example: 49.9 }
          }
        }
      },
      valorEntrega: { type: 'number', example: 10.5 }
    }
  },
  response: {
    200: {
      type: 'object',
      required: ['id', 'total', 'status', 'criadoEm', 'enderecoEntrega', 'itens'],
      properties: {
        id: { type: 'string', example: 'uuid-pedido' },
        total: { type: 'number', example: 110.30 },
        status: { type: 'string', example: 'preparando' },
        criadoEm: { type: 'string', format: 'date-time', example: '2025-06-02T15:00:00Z' },
        enderecoEntrega: {
          type: 'object',
          required: ['id', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'nomeDestinatario', 'telefoneDestinatario'],
          properties: {
            id: { type: 'string', example: 'uuid-endereco' },
            rua: { type: 'string', example: 'Rua Agnelo Guimarães' },
            numero: { type: 'string', example: '123' },
            bairro: { type: 'string', example: 'Três Barras' },
            cidade: { type: 'string', example: 'Linhares' },
            estado: { type: 'string', example: 'ES' },
            cep: { type: 'string', example: '29.907-030' },
            complemento: { type: 'string', example: 'Apto 21' },
            nomeDestinatario: { type: 'string', example: 'João da Silva' },
            telefoneDestinatario: { type: 'string', example: '11912345678' }
          }
        },
        itens: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'pedidoId', 'nome', 'quantidade', 'preco'],
            properties: {
              id: { type: 'string', example: 'uuid-item' },
              pedidoId: { type: 'string', example: 'uuid-pedido' },
              nome: { type: 'string', example: 'Produto A' },
              quantidade: { type: 'number', example: 2 },
              preco: { type: 'number', example: 49.9 }
            }
          }
        }
      }
    }
  }
}
