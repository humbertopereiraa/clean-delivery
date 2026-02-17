import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-stat-card',
    imports: [CommonModule],
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {

  @Input() title = ""
  @Input() value: string | number = ""
  @Input() subtitle = ""
  @Input() icon = ""
  @Input() trend: "up" | "down" | "neutral" = "neutral"

  get trendClass(): string {
    switch (this.trend) {
      case "up":
        return "text-success"
      case "down":
        return "text-danger"
      default:
        return "text-muted"
    }
  }

  get trendIcon(): string {
    switch (this.trend) {
      case "up":
        return "fas fa-arrow-up"
      case "down":
        return "fas fa-arrow-down"
      default:
        return ""
    }
  }
}
