import { describe, it, expect, beforeEach, vi } from "vitest"
import { DashboardHeaderComponent } from "./dashboard-header.component"

describe("DashboardHeaderComponent", () => {
  let component: DashboardHeaderComponent

  beforeEach(() => {
    component = new DashboardHeaderComponent()
  })

  it("deve iniciar com valores padrão", () => {
    expect(component.titulo).toBe("")
    expect(component.subTitulo).toBe("")
    expect(component.labelBotao).toBe("")
    expect(component.iconeBotao).toBe("")
    expect(component.exibirBotao).toBe(false)
  })

  it("deve aceitar valores personalizados nos inputs", () => {
    component.titulo = "Dashboard"
    component.subTitulo = "Visão geral"
    component.labelBotao = "Novo"
    component.iconeBotao = "fas fa-plus"
    component.exibirBotao = true

    expect(component.titulo).toBe("Dashboard")
    expect(component.subTitulo).toBe("Visão geral")
    expect(component.labelBotao).toBe("Novo")
    expect(component.iconeBotao).toBe("fas fa-plus")
    expect(component.exibirBotao).toBe(true)
  })

  it("deve emitir eventoClick ao chamar onClick", () => {
    const emitSpy = vi.spyOn(component.eventoClick, "emit")

    component.onClick()

    expect(emitSpy).toHaveBeenCalled()
  })
})
