import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@angular/core", async () => {
  const actual = await vi.importActual<any>("@angular/core")

  return {
    ...actual,
    inject: vi.fn(),
  }
})

import { inject } from "@angular/core"
import { RedirecionamentoComponent } from "./redirecionamento.component"

describe("RedirecionamentoComponent", () => {
  let authMock: any
  let routerMock: any

  beforeEach(() => {
    authMock = {
      obterUsuarioAtual: vi.fn(),
      redirecionarParaDashboard: vi.fn(),
    }

    routerMock = {
      navigate: vi.fn(),
    }

    ;(inject as any).mockImplementation((token: any) => {
      if (token.name === "AuthService") return authMock
      if (token.name === "Router") return routerMock
    })
  })

  it("deve redirecionar para /login se não houver usuário", () => {
    authMock.obterUsuarioAtual.mockReturnValue(null)

    new RedirecionamentoComponent()

    expect(routerMock.navigate).toHaveBeenCalledWith(["/login"])
    expect(authMock.redirecionarParaDashboard).not.toHaveBeenCalled()
  })

  it("deve redirecionar para dashboard se houver usuário", () => {
    authMock.obterUsuarioAtual.mockReturnValue({ nome: "Admin" })

    new RedirecionamentoComponent()

    expect(authMock.redirecionarParaDashboard).toHaveBeenCalled()
    expect(routerMock.navigate).not.toHaveBeenCalled()
  })
})
