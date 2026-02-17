import { describe, it, expect, beforeEach, vi } from "vitest"
import { FormBuilder, ReactiveFormsModule } from "@angular/forms"
import { CadastroPedidoComponent } from "./cadastro-pedido.component"

describe("CadastroPedidoComponent", () => {
  let component: CadastroPedidoComponent
  let fb: FormBuilder

  beforeEach(() => {
    fb = new FormBuilder()
    component = new CadastroPedidoComponent(fb)
    component.ngOnInit()
  })

  it("deve inicializar o formulário corretamente", () => {
    expect(component.pedidoForm).toBeTruthy()
    expect(component.itens.length).toBe(1)
    expect(component.pedidoForm.get("status")?.value).toBe("preparando")
  })

  it("deve adicionar um item", () => {
    component.adicionarItem()
    expect(component.itens.length).toBe(2)
  })

  it("deve remover item se houver mais de um", () => {
    component.adicionarItem()
    component.removerItem(0)
    expect(component.itens.length).toBe(1)
  })

  it("não deve remover item se houver apenas um", () => {
    component.removerItem(0)
    expect(component.itens.length).toBe(1)
  })

  it("deve calcular total do item corretamente", () => {
    const item = component.itens.at(0)
    item.get("quantidade")?.setValue(2)
    item.get("preco")?.setValue(10)

    expect(component.calcularTotalItem(0)).toBe(20)
  })

  it("deve calcular subtotal corretamente", () => {
    const item = component.itens.at(0)
    item.get("quantidade")?.setValue(3)
    item.get("preco")?.setValue(5)

    expect(component.calcularSubtotal()).toBe(15)
  })

  it("deve calcular total com valorEntrega", () => {
    const item = component.itens.at(0)
    item.get("quantidade")?.setValue(2)
    item.get("preco")?.setValue(10)
    component.pedidoForm.get("valorEntrega")?.setValue(5)

    expect(component.calcularTotal()).toBe(25)
  })

  it("deve formatar CEP corretamente", () => {
    const event: any = { target: { value: "12345678" } }
    component.formatarCEP(event)

    expect(event.target.value).toBe("12345-678")
    expect(component.enderecoEntrega.get("cep")?.value).toBe("12345-678")
  })

  it("deve formatar telefone corretamente (11 dígitos)", () => {
    const event: any = { target: { value: "11987654321" } }
    component.formatarTelefone(event)

    expect(event.target.value).toContain("(")
    expect(component.enderecoEntrega.get("telefoneDestinatario")?.value).toBe(
      event.target.value
    )
  })

  it("deve formatar estado para maiúsculo", () => {
    const event: any = { target: { value: "sp" } }
    component.formatarEstado(event)

    expect(event.target.value).toBe("SP")
    expect(component.enderecoEntrega.get("estado")?.value).toBe("SP")
  })

  it("deve criar pedido e resetar formulário quando válido", async () => {
    const erroSpy = vi.spyOn(component.erro, "emit")

    component.pedidoForm.patchValue({
      clienteId: "123",
      valorEntrega: 10,
    })

    component.enderecoEntrega.patchValue({
      rua: "Rua A",
      numero: "123",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "12345-678",
      nomeDestinatario: "João",
      telefoneDestinatario: "(11) 98765-4321",
    })

    component.itens.at(0).patchValue({
      nome: "Produto",
      quantidade: 2,
      preco: 50,
    })

    expect(component.pedidoForm.valid).toBe(true)

    await component.criarPedido()

    expect(erroSpy).not.toHaveBeenCalled()
    expect(component.carregando).toBe(false)
    expect(component.itens.length).toBe(1)
  })

  it("deve retornar erro de campo obrigatório", () => {
    const field = component.pedidoForm.get("clienteId")
    field?.markAsTouched()

    expect(component.isFieldInvalid("clienteId")).toBe(true)
    expect(component.getFieldError("clienteId")).toBe(
      "Este campo é obrigatório"
    )
  })

  it("deve retornar erro de valor mínimo", () => {
    const field = component.pedidoForm.get("valorEntrega")
    field?.setValue(-1)
    field?.markAsTouched()

    expect(component.getFieldError("valorEntrega")).toContain("Valor mínimo")
  })
})
