import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth.guard'
import { perfilGuard } from './core/guards/perfil.guard'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'cliente',
    canActivate: [authGuard, perfilGuard],
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClienteModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/redirecionamento/redirecionamento.component').then(m => m.RedirecionamentoComponent)
  }
]
