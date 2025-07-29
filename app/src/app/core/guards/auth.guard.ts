import { inject, Injector } from "@angular/core"
import { Router, CanActivateFn } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const injector = inject(Injector)
  const authService = injector.get(AuthService)
  const router = injector.get(Router)

  if (authService.isAutenticado()) return true

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  })

  return false
}