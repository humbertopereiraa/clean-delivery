import { describe, it, expect, beforeEach } from 'vitest'
import { ClienteMenuService } from './cliente-menu.service'

describe('ClienteMenuService', () => {

  let service: ClienteMenuService

  beforeEach(() => {
    service = new ClienteMenuService()
  })

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy()
  })

  it('deve retornar o menu do cliente', () => {
    const menu = service.obterMenu()

    expect(menu).toBeDefined()
    expect(Array.isArray(menu)).toBe(true)
    expect(menu.length).toBe(1)
  })

  it('deve retornar item de dashboard corretamente configurado', () => {
    const menu = service.obterMenu()
    const item = menu[0]

    expect(item.id).toBe('dashboard')
    expect(item.titulo).toBe('Dashboard')
    expect(item.icone).toBe('fa-solid fa-gauge')
    expect(item.rota).toBe('/cliente/dashboard')
  })

  it('deve retornar uma nova instância de array a cada chamada', () => {
    const menu1 = service.obterMenu()
    const menu2 = service.obterMenu()

    expect(menu1).not.toBe(menu2) // referência diferente
  })
})
