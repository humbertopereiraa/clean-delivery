import { Component, inject } from '@angular/core'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'

@Component({
  standalone: true,
  template: '',
})
export class RedirecionamentoComponent {

  private auth = inject(AuthService)
  private router = inject(Router)

  constructor() {
    const usuario = this.auth.obterUsuarioAtual()

    if (!usuario) {
      this.router.navigate(['/login'])
      return
    }

    this.auth.redirecionarParaDashboard()
  }
}
