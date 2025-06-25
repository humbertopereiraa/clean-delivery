enum Role {
  CLIENTE = 'cliente',
  ENTREGADOR = 'entregador',
  ADMIN = 'admin'
}

export enum ETipoEvento {
  USUARIO_CRIADO = 'usuario.criado',
  USUARIO_ATUALIZADO = 'usuario.atualizado',
  USUARIO_DELETADO = 'usuario.deletado'
}

interface IUsuarioPayLoad {
  id: string,
  nome: string,
  email: string,
  role: Role
}

export interface IEvento {
  tipo: ETipoEvento
  payload: PayLoad
}
export type PayLoad = IUsuarioPayLoad

