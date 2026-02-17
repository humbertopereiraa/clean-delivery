import { describe, it, expect, beforeEach } from "vitest"
import { StatCardComponent } from "./stat-card.component"

describe("StatCardComponent", () => {
  let component: StatCardComponent

  beforeEach(() => {
    component = new StatCardComponent()
  })

  it("deve iniciar com valores padrão", () => {
    expect(component.title).toBe("")
    expect(component.value).toBe("")
    expect(component.subtitle).toBe("")
    expect(component.icon).toBe("")
    expect(component.trend).toBe("neutral")
  })

  it("deve retornar text-success quando trend for up", () => {
    component.trend = "up"
    expect(component.trendClass).toBe("text-success")
  })

  it("deve retornar text-danger quando trend for down", () => {
    component.trend = "down"
    expect(component.trendClass).toBe("text-danger")
  })

  it("deve retornar text-muted quando trend for neutral", () => {
    component.trend = "neutral"
    expect(component.trendClass).toBe("text-muted")
  })

  it("deve retornar ícone de seta para cima quando trend for up", () => {
    component.trend = "up"
    expect(component.trendIcon).toBe("fas fa-arrow-up")
  })

  it("deve retornar ícone de seta para baixo quando trend for down", () => {
    component.trend = "down"
    expect(component.trendIcon).toBe("fas fa-arrow-down")
  })

  it("deve retornar string vazia quando trend for neutral", () => {
    component.trend = "neutral"
    expect(component.trendIcon).toBe("")
  })

  it("deve aceitar valores personalizados nos inputs", () => {
    component.title = "Vendas"
    component.value = 1500
    component.subtitle = "Últimos 30 dias"
    component.icon = "fas fa-chart-line"
    component.trend = "up"

    expect(component.title).toBe("Vendas")
    expect(component.value).toBe(1500)
    expect(component.subtitle).toBe("Últimos 30 dias")
    expect(component.icon).toBe("fas fa-chart-line")
    expect(component.trendClass).toBe("text-success")
  })
})
