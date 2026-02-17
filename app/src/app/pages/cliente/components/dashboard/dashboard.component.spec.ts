import { describe, it, expect, beforeEach, vi } from "vitest"
import { DashboardComponent } from "./dashboard.component"

describe("DashboardComponent", () => {
  let component: DashboardComponent
  let authServiceMock: any

  let popupMock: any
  let cadastroPedidoMock: any

  beforeEach(() => {
    authServiceMock = {
      obterUsuarioAtual: vi.fn().mockReturnValue({
        nome: "Admin",
        role: "ADMIN",
      }),
    }

    component = new DashboardComponent(authServiceMock)

    popupMock = {
      abrir: vi.fn(),
      fechar: vi.fn(),
    }

    cadastroPedidoMock = {
      criarPedido: vi.fn(),
    }

    // Simula ViewChild
    component.popupPedido = popupMock
    component.cadastroPedido = cadastroPedidoMock
  })

  it("deve inicializar usuarioAtual via AuthService", () => {
    expect(authServiceMock.obterUsuarioAtual).toHaveBeenCalled()
    expect(component.usuarioAtual?.nome).toBe("Admin")
  })

  it("deve abrir popup ao clicar", () => {
    component.onClick()

    expect(popupMock.abrir).toHaveBeenCalled()
  })

  it("deve chamar criarPedido quando botão for salvar", () => {
    component.onBotaoClicado("salvar")

    expect(cadastroPedidoMock.criarPedido).toHaveBeenCalled()
  })

  it("deve fechar popup quando botão for cancelar", () => {
    component.onBotaoClicado("cancelar")

    expect(popupMock.fechar).toHaveBeenCalled()
  })

  it("não deve fazer nada para botão desconhecido", () => {
    component.onBotaoClicado("outro")

    expect(cadastroPedidoMock.criarPedido).not.toHaveBeenCalled()
    expect(popupMock.fechar).not.toHaveBeenCalled()
  })

  it("deve fechar popup ao criar pedido com sucesso", () => {
    const alertSpy = vi.spyOn(global, "alert").mockImplementation(() => {})
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    component.onPedidoCriado({ id: 1 })

    expect(consoleSpy).toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledWith("Pedido criado com sucesso!")
    expect(popupMock.fechar).toHaveBeenCalled()

    alertSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  it("deve exibir alerta ao ocorrer erro", () => {
    const alertSpy = vi.spyOn(global, "alert").mockImplementation(() => {})
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    component.onErro("Erro teste")

    expect(consoleSpy).toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledWith("Erro: Erro teste")

    alertSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  it("não deve quebrar ao fechar modal", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    component.onModalFechado()

    expect(consoleSpy).toHaveBeenCalledWith("Modal fechado")

    consoleSpy.mockRestore()
  })

  it("deve ter 4 statsCards definidos", () => {
    expect(component.statsCards.length).toBe(4)
  })
})
