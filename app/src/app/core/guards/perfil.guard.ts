import { inject, Injector } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const perfilGuard: CanActivateFn = (route, state) => {
  const injector = inject(Injector)
  const authService = injector.get(AuthService)
  const router = injector.get(Router)

  const usuario = authService.obterUsuarioAtual()

  if (!usuario || !usuario.role) {
    return router.navigate(['/login'])
  }

  const url = state.url
  const tipo = usuario?.role.toLowerCase()

  if (!url.startsWith(`/${tipo}`)) {
    authService.redirecionarParaDashboard()
    return false
  }

  return true
}