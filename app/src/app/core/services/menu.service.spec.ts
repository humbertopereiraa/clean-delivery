import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MenuService } from './menu.service'
import { ClienteMenuService } from './cliente-menu.service'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'
import { IItemMenu } from '../models/menu.model'

describe('MenuService', () => {

  let service: MenuService
  let mockClienteMenuService: { obterMenu: ReturnType<typeof vi.fn> }

  const menuMock: IItemMenu[] = [
    {
      id: 'dashboard',
      titulo: 'Dashboard',
      icone: 'fa-solid fa-gauge',
      rota: '/cliente/dashboard'
    }
  ]

  beforeEach(() => {
    mockClienteMenuService = {
      obterMenu: vi.fn().mockReturnValue(menuMock)
    }

    service = new MenuService(mockClienteMenuService as unknown as ClienteMenuService)
  })

  it('deve chamar ClienteMenuService quando tipo for CLIENTE', () => {
    const resultado = service.obterMenu(ETipoUsuario.CLIENTE)

    expect(mockClienteMenuService.obterMenu).toHaveBeenCalledTimes(1)
    expect(resultado).toEqual(menuMock)
  })

  it('deve retornar array vazio para ENTREGADORES', () => {
    const resultado = service.obterMenu(ETipoUsuario.ENTREGADORES)

    expect(resultado).toEqual([])
    expect(mockClienteMenuService.obterMenu).not.toHaveBeenCalled()
  })

  it('deve retornar array vazio para ADMIN', () => {
    const resultado = service.obterMenu(ETipoUsuario.ADMIN)

    expect(resultado).toEqual([])
    expect(mockClienteMenuService.obterMenu).not.toHaveBeenCalled()
  })

  it('deve retornar array vazio para tipo inválido', () => {
    const resultado = service.obterMenu(undefined as any)

    expect(resultado).toEqual([])
    expect(mockClienteMenuService.obterMenu).not.toHaveBeenCalled()
  })

})
