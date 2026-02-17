import { CommonModule } from "@angular/common"
import { Component, Input, Output, EventEmitter, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"

declare var bootstrap: any

@Component({
  selector: "app-popup",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.css"],
})
export class PopupComponent implements AfterViewInit {
  @Input() botoes: string[] = ["cancelar", "salvar"]
  @Input() titulo = "Modal"
  @Input() tamanho: "sm" | "lg" | "xl" | "" = "lg"

  @Output() botaoClicado = new EventEmitter<string>()
  @Output() modalFechado = new EventEmitter<void>()

  @ViewChild("modalElement", { static: true }) modalElement!: ElementRef

  private modal: any

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.modalElement.nativeElement)
    this.modalElement.nativeElement.addEventListener("hidden.bs.modal", () => {
      this.modalFechado.emit()
    })
  }

  abrir() {
    this.modal.show()
  }

  fechar() {
    this.modal.hide()
  }

  onBotaoClick(botao: string) {
    this.botaoClicado.emit(botao)
  }

  getBotaoClasse(botao: string): string {
    switch (botao.toLowerCase()) {
      case "salvar":
      case "confirmar":
        return "btn-primary"
      case "cancelar":
      case "fechar":
        return "btn-secondary"
      case "excluir":
      case "deletar":
        return "btn-danger"
      default:
        return "btn-outline-primary"
    }
  }

  getBotaoTexto(botao: string): string {
    return botao.charAt(0).toUpperCase() + botao.slice(1)
  }
}
