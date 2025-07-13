import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
]
