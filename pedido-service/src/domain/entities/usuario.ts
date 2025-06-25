export enum Role {
  CLIENTE = 'cliente',
  ENTREGADOR = 'entregador',
  ADMIN = 'admin',
}

export class Usuario {
  constructor(readonly id: string, readonly nome: string, readonly email: string, readonly role: Role) {
    if (!id || !nome || !email || !role) {
      throw new Error('Dados inválidos para criação de usuário.')
    }
  }
}