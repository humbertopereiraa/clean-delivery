import { describe, it, expect, beforeEach, vi } from "vitest"
import { ElementRef } from "@angular/core"
import { PopupComponent } from "./popup.component"

describe("PopupComponent", () => {
  let component: PopupComponent
  let modalMock: any
  let addEventListenerMock: any

  beforeEach(() => {
    modalMock = {
      show: vi.fn(),
      hide: vi.fn(),
    }

      ; (global as any).bootstrap = {
        Modal: vi.fn(function () {
          return modalMock
        }),
      }

    addEventListenerMock = vi.fn()

    const elementMock = {
      nativeElement: {
        addEventListener: addEventListenerMock,
      },
    }

    component = new PopupComponent()
    component.modalElement = elementMock as any
  })

  it("deve inicializar o modal no ngAfterViewInit", () => {
    component.ngAfterViewInit()

    expect((global as any).bootstrap.Modal).toHaveBeenCalled()
    expect(addEventListenerMock).toHaveBeenCalledWith(
      "hidden.bs.modal",
      expect.any(Function)
    )
  })

  it("deve emitir modalFechado ao disparar hidden.bs.modal", () => {
    const emitSpy = vi.spyOn(component.modalFechado, "emit")

    component.ngAfterViewInit()

    const callback = addEventListenerMock.mock.calls[0][1]
    callback()

    expect(emitSpy).toHaveBeenCalled()
  })

  it("deve chamar show ao abrir modal", () => {
    component.ngAfterViewInit()
    component.abrir()

    expect(modalMock.show).toHaveBeenCalled()
  })

  it("deve chamar hide ao fechar modal", () => {
    component.ngAfterViewInit()
    component.fechar()

    expect(modalMock.hide).toHaveBeenCalled()
  })

  it("deve emitir evento ao clicar botão", () => {
    const emitSpy = vi.spyOn(component.botaoClicado, "emit")

    component.onBotaoClick("salvar")

    expect(emitSpy).toHaveBeenCalledWith("salvar")
  })

  it("deve retornar btn-primary para salvar", () => {
    expect(component.getBotaoClasse("salvar")).toBe("btn-primary")
  })

  it("deve retornar btn-secondary para cancelar", () => {
    expect(component.getBotaoClasse("cancelar")).toBe("btn-secondary")
  })

  it("deve retornar btn-danger para excluir", () => {
    expect(component.getBotaoClasse("excluir")).toBe("btn-danger")
  })

  it("deve retornar classe padrão para botão desconhecido", () => {
    expect(component.getBotaoClasse("outro")).toBe("btn-outline-primary")
  })

  it("deve capitalizar texto do botão", () => {
    expect(component.getBotaoTexto("salvar")).toBe("Salvar")
  })
})
