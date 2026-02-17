import { describe, it, expect, vi } from 'vitest'
import {
  createEnvironmentInjector,
  runInInjectionContext,
  EnvironmentInjector,
  Injector
} from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { authGuard } from './auth.guard'

describe('authGuard', () => {

  function setup(isAutenticado: boolean) {

    const mockAuthService = {
      isAutenticado: vi.fn().mockReturnValue(isAutenticado)
    }

    const mockRouter = {
      navigate: vi.fn()
    }

    // Injector raiz vazio
    const rootInjector = Injector.create({ providers: [] })

    const injector: EnvironmentInjector = createEnvironmentInjector(
      [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      rootInjector as EnvironmentInjector
    )

    return { injector, mockRouter }
  }

  it('deve permitir acesso quando autenticado', () => {
    const { injector, mockRouter } = setup(true)

    const result = runInInjectionContext(injector, () =>
      authGuard({} as any, { url: '/dashboard' } as any)
    )

    expect(result).toBe(true)
    expect(mockRouter.navigate).not.toHaveBeenCalled()
  })

  it('deve redirecionar para /login quando não autenticado', () => {
    const { injector, mockRouter } = setup(false)

    const result = runInInjectionContext(injector, () =>
      authGuard({} as any, { url: '/dashboard' } as any)
    )

    expect(result).toBe(false)
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    )
  })
})
