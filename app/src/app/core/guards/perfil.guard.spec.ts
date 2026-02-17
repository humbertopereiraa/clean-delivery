import { describe, it, expect, vi } from 'vitest'
import {
  createEnvironmentInjector,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { perfilGuard } from './perfil.guard'

describe('perfilGuard', () => {

  function setup(usuarioMock: any) {

    const mockAuthService = {
      obterUsuarioAtual: vi.fn().mockReturnValue(usuarioMock),
      redirecionarParaDashboard: vi.fn()
    }

    const mockRouter = {
      navigate: vi.fn()
    }

    const injector = createEnvironmentInjector(
      [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      undefined as unknown as EnvironmentInjector
    )

    return { injector, mockAuthService, mockRouter }
  }

  it('deve redirecionar para /login se não houver usuário', () => {
    const { injector, mockRouter } = setup(null)

    const result = runInInjectionContext(injector, () =>
      perfilGuard({} as any, { url: '/admin/home' } as any)
    )

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'])
    expect(result).toBe(mockRouter.navigate.mock.results[0].value)
  })

  it('deve redirecionar para dashboard se URL não corresponder ao role', () => {
    const usuario = { role: 'ADMIN' }
    const { injector, mockAuthService } = setup(usuario)

    const result = runInInjectionContext(injector, () =>
      perfilGuard({} as any, { url: '/cliente/home' } as any)
    )

    expect(mockAuthService.redirecionarParaDashboard).toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('deve permitir acesso quando URL corresponder ao role', () => {
    const usuario = { role: 'ADMIN' }
    const { injector, mockAuthService, mockRouter } = setup(usuario)

    const result = runInInjectionContext(injector, () =>
      perfilGuard({} as any, { url: '/admin/dashboard' } as any)
    )

    expect(result).toBe(true)
    expect(mockAuthService.redirecionarParaDashboard).not.toHaveBeenCalled()
    expect(mockRouter.navigate).not.toHaveBeenCalled()
  })
})
