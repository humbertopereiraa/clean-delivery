export interface IAutenticacaoOutputDTO {
  id: string
  nome: string
  email: string
  cpf: string
  role: 'cliente' | 'entregador' | 'admin'
  token: string
}