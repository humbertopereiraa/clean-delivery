export interface ICriarPedidoInputDTO {
  clienteId: string
  endereco: {
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
    pedidoId: string
    nome: string
    quantidade: number
    preco: number
  }[]
  valorEntrega: number
}
