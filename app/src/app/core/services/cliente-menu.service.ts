import { Injectable } from '@angular/core'
import { IItemMenu, IMenu } from '../models/menu.model'

@Injectable({
  providedIn: 'root'
})
export class ClienteMenuService implements IMenu {

  constructor() { }

  public obterMenu(): IItemMenu[] {
    return [
      {
        id: "dashboard",
        titulo: "Dashboard",
        icone: "fa-solid fa-gauge",
        rota: "/cliente/dashboard"
      },
      // {
      //   id: "pedido",
      //   titulo: "Pedido",
      //   icone: "fas fa-cookie",
      //   rota: "/cliente/pedido"
      // },
    ]
  }
}
