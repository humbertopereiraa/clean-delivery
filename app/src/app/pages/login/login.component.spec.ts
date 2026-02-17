import { describe, it, expect, beforeEach, vi } from "vitest"
import { FormBuilder } from "@angular/forms"
import { of, throwError } from "rxjs"
import { LoginComponent } from "./login.component"
import { AuthService } from "../../core/services/auth.service"

describe("LoginComponent", () => {
  let component: LoginComponent
  let formBuilder: FormBuilder
  let authServiceMock: Partial<AuthService>

  beforeEach(() => {
    formBuilder = new FormBuilder()

    authServiceMock = {
      logar: vi.fn(),
      redirecionarParaDashboard: vi.fn(),
    }

    component = new LoginComponent(
      formBuilder,
      authServiceMock as AuthService
    )
  })

  it("deve criar o formulário corretamente", () => {
    expect(component.loginForm).toBeTruthy()
    expect(component.email).toBeTruthy()
    expect(component.password).toBeTruthy()
  })

  it("deve iniciar com isLoading false", () => {
    expect(component.isLoading).toBe(false)
  })

  it("deve invalidar formulário vazio", () => {
    expect(component.loginForm.valid).toBe(false)
  })

  it("deve validar formulário com dados corretos", () => {
    component.loginForm.setValue({
      email: "teste@email.com",
      password: "123456",
    })

    expect(component.loginForm.valid).toBe(true)
  })

  it("não deve chamar logar se formulário inválido", async () => {
    await component.onSubmit()

    expect(authServiceMock.logar).not.toHaveBeenCalled()
  })

  it("deve chamar logar quando formulário válido", async () => {
    component.loginForm.setValue({
      email: "teste@email.com",
      password: "123456",
    })

    ;(authServiceMock.logar as any).mockReturnValue(
      of({ sucesso: true })
    )

    await component.onSubmit()

    expect(authServiceMock.logar).toHaveBeenCalledWith({
      email: "teste@email.com",
      password: "123456",
    })
  })

  it("deve redirecionar quando login for sucesso", async () => {
    component.loginForm.setValue({
      email: "teste@email.com",
      password: "123456",
    })

    ;(authServiceMock.logar as any).mockReturnValue(
      of({ sucesso: true })
    )

    await component.onSubmit()

    expect(authServiceMock.redirecionarParaDashboard).toHaveBeenCalled()
    expect(component.isLoading).toBe(false)
  })

  it("não deve redirecionar se sucesso for false", async () => {
    component.loginForm.setValue({
      email: "teste@email.com",
      password: "123456",
    })

    ;(authServiceMock.logar as any).mockReturnValue(
      of({ sucesso: false })
    )

    await component.onSubmit()

    expect(authServiceMock.redirecionarParaDashboard).not.toHaveBeenCalled()
    expect(component.isLoading).toBe(false)
  })

  it("deve parar loading se ocorrer erro", async () => {
    component.loginForm.setValue({
      email: "teste@email.com",
      password: "123456",
    })

    ;(authServiceMock.logar as any).mockReturnValue(
      throwError(() => new Error("Erro login"))
    )

    await component.onSubmit()

    expect(component.isLoading).toBe(false)
  })

  it("deve alternar visibilidade da senha", () => {
    expect(component.showPassword()).toBe(false)

    component.togglePasswordVisibility()
    expect(component.showPassword()).toBe(true)

    component.togglePasswordVisibility()
    expect(component.showPassword()).toBe(false)
  })
})
