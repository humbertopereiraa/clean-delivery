export enum ETipoEvento {
  USUARIO_CRIADO = 'usuario.criado',
  USUARIO_ATUALIZADO = 'usuario.atualizado',
  USUARIO_DELETADO = 'usuario.deletado'
}
export interface IEvento {
  tipo: ETipoEvento,
  payload: any
}
