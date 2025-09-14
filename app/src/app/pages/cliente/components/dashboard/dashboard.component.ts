import { Component, OnInit } from '@angular/core'
import { IUsuario } from '../../../../models/usuario.model'
import { AuthService } from '../../../../core/services/auth.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public usuarioAtual: IUsuario | null
  statsCards = [
    {
      title: "Pedidos Hoje",
      value: "23",
      icon: "fas fa-box",
      trend: "up" as const,
    },
    {
      title: "Faturamento",
      value: "R$ 1.247",
      icon: "fas fa-dollar-sign",
      trend: "up" as const,
    },
    {
      title: "Tempo Médio",
      value: "18 min",
      icon: "fas fa-clock",
      trend: "up" as const,
    },
    {
      title: "Avaliação",
      value: "4.8",
      icon: "fas fa-star",
      trend: "up" as const,
    },
  ]

  constructor(private authService: AuthService) {
    this.usuarioAtual = this.authService.obterUsuarioAtual()
  }

  ngOnInit() { }

  public onClick(): void {

  }
}
