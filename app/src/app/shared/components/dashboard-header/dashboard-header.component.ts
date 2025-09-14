import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent {

  @Input() titulo = ""
  @Input() subTitulo = ""
  @Input() labelBotao = ""
  @Input() iconeBotao = ""
  @Input() exibirBotao = false

  @Output() eventoClick = new EventEmitter<void>()

  onClick(): void {
    this.eventoClick.emit()
  }
}
