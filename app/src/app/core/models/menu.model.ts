export interface IItemMenu {
  id: string
  titulo: string
  icone: string
  rota: string
  subItens?: IItemMenu[]
}

export interface IMenu {
  obterMenu(): IItemMenu[]
}
