export interface ICriarPedidoOutputDTO {
  id: string
  total: number
  status: string
  criadoEm: string
  enderecoEntrega: {
    id: string,
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    complemento?: string
    nomeDestinatario: string
    telefoneDestinatario: string
  }
  itens: {
    id: string,
    pedidoId: string
    nome: string
    quantidade: number
    preco: number
  }[]
}
