import { Component, OnInit, ViewChild } from '@angular/core'
import { IUsuario } from '../../../../models/usuario.model'
import { AuthService } from '../../../../core/services/auth.service'
import { PopupComponent } from '../../../../shared/components/popup/popup.component'
import { CadastroPedidoComponent } from '../cadastro-pedido/cadastro-pedido.component'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("popupPedido") popupPedido!: PopupComponent
  @ViewChild("cadastroPedido") cadastroPedido!: CadastroPedidoComponent

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
    this.popupPedido.abrir()
  }

  onBotaoClicado(botao: string) {
    switch (botao) {
      case "salvar":
        this.cadastroPedido.criarPedido()
        break
      case "cancelar":
        this.popupPedido.fechar()
        break
    }
  }

  onPedidoCriado(pedido: any) {
    console.log("Pedido criado com sucesso:", pedido)
    alert("Pedido criado com sucesso!")
    this.popupPedido.fechar()
  }

  onErro(erro: string) {
    console.error("Erro:", erro)
    alert("Erro: " + erro)
  }

  onModalFechado() {
    console.log("Modal fechado")
  }
}
