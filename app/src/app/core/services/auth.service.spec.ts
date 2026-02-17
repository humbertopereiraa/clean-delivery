import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from './auth.service'
import { ETipoUsuario } from '../enums/tipo-usuario.enum'
import { firstValueFrom } from 'rxjs'

describe('AuthService', () => {

  let service: AuthService
  let mockRouter: any

  beforeEach(() => {
    localStorage.clear()

    mockRouter = {
      navigate: vi.fn()
    }

    service = new AuthService(mockRouter)
  })

  it('deve realizar login com sucesso', async () => {
    const response = await firstValueFrom(
      service.logar({
        email: 'cliente@email.com',
        password: '123456'
      })
    )

    expect(response.sucesso).toBe(true)
    expect(response.usuario?.email).toBe('cliente@email.com')
    expect(service.isAutenticado()).toBe(true)
    expect(service.obterToken()).toContain('mock-jwt-token')
  })

  it('deve falhar login com senha incorreta', async () => {
    const response = await firstValueFrom(
      service.logar({
        email: 'cliente@email.com',
        password: 'senha-errada'
      })
    )

    expect(response.sucesso).toBe(false)
    expect(response.mensagem).toBe('Email ou senha inválidos')
    expect(service.isAutenticado()).toBe(false)
  })

  it('deve deslogar corretamente', async () => {
    await firstValueFrom(
      service.logar({
        email: 'cliente@email.com',
        password: '123456'
      })
    )

    service.deslogar()

    expect(service.isAutenticado()).toBe(false)
    expect(service.obterUsuarioAtual()).toBeNull()
    expect(localStorage.getItem('delivery-app-token')).toBeNull()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('deve redirecionar cliente para dashboard correto', async () => {
    await firstValueFrom(
      service.logar({
        email: 'cliente@email.com',
        password: '123456'
      })
    )

    service.redirecionarParaDashboard()

    expect(mockRouter.navigate).toHaveBeenCalledWith(['cliente/dashboard'])
  })

  it('deve redirecionar entregador para dashboard correto', async () => {
    await firstValueFrom(
      service.logar({
        email: 'entregador@email.com',
        password: '123456'
      })
    )

    service.redirecionarParaDashboard()

    expect(mockRouter.navigate).toHaveBeenCalledWith(['entregador/dashboard'])
  })

  it('deve redirecionar admin para dashboard correto', async () => {
    await firstValueFrom(
      service.logar({
        email: 'admin@email.com',
        password: '123456'
      })
    )

    service.redirecionarParaDashboard()

    expect(mockRouter.navigate).toHaveBeenCalledWith(['admin/dashboard'])
  })

  it('deve redirecionar para login se não houver usuário', () => {
    service.redirecionarParaDashboard()

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('deve restaurar autenticação se houver token no localStorage', () => {
    const usuarioMock = {
      id: '1',
      nome: 'Teste',
      email: 'teste@email.com',
      role: ETipoUsuario.CLIENTE,
      cpf: '123'
    }

    localStorage.setItem('delivery-app-token', 'token')
    localStorage.setItem('delivery-app-usuario', JSON.stringify(usuarioMock))

    const newService = new AuthService(mockRouter)

    expect(newService.isAutenticado()).toBe(true)
    expect(newService.obterUsuarioAtual()?.email).toBe('teste@email.com')
  })
})
