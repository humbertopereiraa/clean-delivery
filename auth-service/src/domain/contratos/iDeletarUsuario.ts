export interface IDeletarUsuario {
  execute(id: string): Promise<void>
}
