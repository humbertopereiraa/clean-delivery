import { Injectable } from '@angular/core'
import { ClienteMenuService } from './cliente-menu.service'
import { IItemMenu } from '../models/menu.model'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private clienteMenuService: ClienteMenuService) { }

  public obterMenu(tipoUsuario: ETipoUsuario): IItemMenu[] {
    switch (tipoUsuario) {
      case ETipoUsuario.CLIENTE:
        return this.clienteMenuService.obterMenu()
      case ETipoUsuario.ENTREGADORES:
        return []
      case ETipoUsuario.ADMIN:
        return []
      default:
        return []
    }
  }
}
