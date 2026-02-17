import { describe, it, expect, beforeEach, vi } from "vitest"
import { Subject } from "rxjs"
import { NavigationEnd } from "@angular/router"

import { LayoutComponent } from "./layout.component"
import { ETipoUsuario } from "../../../core/enums/tipo-usuario.enum"

describe("LayoutComponent", () => {
  let component: LayoutComponent

  let usuarioSubject: Subject<any>
  let routerEventsSubject: Subject<any>

  let authServiceMock: any
  let menuServiceMock: any
  let routerMock: any

  beforeEach(() => {
    usuarioSubject = new Subject()
    routerEventsSubject = new Subject()

    authServiceMock = {
      usuarioAtual$: usuarioSubject.asObservable(),
      deslogar: vi.fn(),
    }

    menuServiceMock = {
      obterMenu: vi.fn(),
    }

    routerMock = {
      events: routerEventsSubject.asObservable(),
      navigate: vi.fn(),
      url: "/dashboard",
    }

    component = new LayoutComponent(
      authServiceMock,
      menuServiceMock,
      routerMock
    )
  })

  it("deve inicializar usuário ao iniciar", () => {
    const menuMock = [{ titulo: "Home", rota: "/dashboard" }]
    menuServiceMock.obterMenu.mockReturnValue(menuMock)

    component.ngOnInit()

    usuarioSubject.next({
      nome: "Admin",
      role: ETipoUsuario.ADMIN,
    })

    expect(component.usuarioAtual?.nome).toBe("Admin")
    expect(component.itensMenu).toEqual(menuMock)
    expect(component.usuarioAtual?.avatar).toContain("avatar-admin")
    expect(component.isLogado).toBe(true)
  })

  it("deve alternar sidebarCollapsed", () => {
    expect(component.sidebarCollapsed).toBe(false)

    component.alternarSidebar()
    expect(component.sidebarCollapsed).toBe(true)

    component.alternarSidebar()
    expect(component.sidebarCollapsed).toBe(false)
  })

  it("deve deslogar e navegar para login", () => {
    component.realizarLogout()

    expect(authServiceMock.deslogar).toHaveBeenCalled()
    expect(routerMock.navigate).toHaveBeenCalledWith(["/login"])
  })

  it("deve atualizar título baseado na rota", () => {
    component.itensMenu = [
      { titulo: "Pedidos", rota: "/pedidos" },
    ] as any

    component["atualizarTitulo"]("/pedidos/lista")

    expect(component.tituloAtual).toBe("Pedidos")
  })

  it("deve manter Dashboard se rota não encontrada", () => {
    component.itensMenu = []

    component["atualizarTitulo"]("/rota-invalida")

    expect(component.tituloAtual).toBe("Dashboard")
  })

  it("deve reagir a NavigationEnd", () => {
    component.itensMenu = [
      { titulo: "Clientes", rota: "/clientes" },
    ] as any

    component.ngOnInit()

    routerEventsSubject.next(
      new NavigationEnd(1, "/clientes", "/clientes")
    )

    expect(component.tituloAtual).toBe("Clientes")
  })

  it("não deve estar logado se estiver na rota /login", () => {
    routerMock.url = "/login"

    component.ngOnInit()

    usuarioSubject.next({
      nome: "Admin",
      role: ETipoUsuario.ADMIN,
    })

    expect(component.isLogado).toBe(false)
  })

  it("deve completar destroy$ no ngOnDestroy", () => {
    const nextSpy = vi.spyOn(component["destroy$"], "next")
    const completeSpy = vi.spyOn(component["destroy$"], "complete")

    component.ngOnDestroy()

    expect(nextSpy).toHaveBeenCalled()
    expect(completeSpy).toHaveBeenCalled()
  })
})
