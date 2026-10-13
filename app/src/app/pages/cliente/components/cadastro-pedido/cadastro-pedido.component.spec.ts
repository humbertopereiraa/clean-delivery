import { describe, it, expect, beforeEach, vi, type Mock } from "vitest"
import { FormBuilder } from "@angular/forms"
import { of, throwError, type Observable } from "rxjs"
import { NgWizardService } from "ng-wizard"
import { CadastroPedidoComponent } from "./cadastro-pedido.component"
import {
  PedidoService,
  type PedidoRequest,
  type PedidoResponse,
} from "../../../../shared/services/pedido.service"

interface EventoCampo {
  target: { value: string }
}

interface WizardMock {
  reset: Mock<() => void>
}

interface PedidoServiceMock {
  criarPedido: Mock<(pedido: PedidoRequest) => Observable<PedidoResponse>>
}

function eventoCampo(valor: string): EventoCampo {
  return { target: { value: valor } }
}

const respostaPedido: PedidoResponse = {
  id: "pedido-1",
  total: "110.00",
  status: "preparando",
  criadoEm: "2026-10-12T21:00:00.000Z",
  enderecoEntrega: {
    id: "endereco-1",
    rua: "Rua A",
    numero: "123",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "12345-678",
    nomeDestinatario: "João",
    telefoneDestinatario: "(11) 98765-4321",
    complemento: "",
  },
  itens: [{
    id: "item-1",
    pedidoId: "pedido-1",
    nome: "Produto",
    quantidade: 2,
    preco: "50.00",
  }],
}

describe("CadastroPedidoComponent", () => {
  let component: CadastroPedidoComponent
  let wizard: WizardMock
  let pedidoService: PedidoServiceMock

  beforeEach(() => {
    wizard = {
      reset: vi.fn<() => void>(),
    }
    pedidoService = {
      criarPedido: vi.fn<(pedido: PedidoRequest) => Observable<PedidoResponse>>(),
    }

    component = new CadastroPedidoComponent(
      new FormBuilder(),
      wizard as unknown as NgWizardService,
      pedidoService as unknown as PedidoService,
    )
    component.ngOnInit()
  })

  function preencherPedidoValido(): void {
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
  }

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
    const event = eventoCampo("12345678")
    component.formatarCEP(event)

    expect(event.target.value).toBe("12345-678")
    expect(component.enderecoEntrega.get("cep")?.value).toBe("12345-678")
  })

  it("deve formatar telefone corretamente (11 dígitos)", () => {
    const event = eventoCampo("11987654321")
    component.formatarTelefone(event)

    expect(event.target.value).toBe("(11) 98765-4321")
    expect(component.enderecoEntrega.get("telefoneDestinatario")?.value).toBe("(11) 98765-4321")
  })

  it("deve formatar estado para maiúsculo", () => {
    const event = eventoCampo("sp")
    component.formatarEstado(event)

    expect(event.target.value).toBe("SP")
    expect(component.enderecoEntrega.get("estado")?.value).toBe("SP")
  })

  it("não deve criar pedido quando o formulário é inválido", async () => {
    await component.criarPedido()

    expect(pedidoService.criarPedido).not.toHaveBeenCalled()
    expect(component.carregando).toBe(false)
  })

  it("deve criar pedido e resetar formulário quando válido", async () => {
    const erroSpy = vi.spyOn(component.erro, "emit")
    const pedidoCriadoSpy = vi.spyOn(component.pedidoCriado, "emit")
    pedidoService.criarPedido.mockReturnValue(of(respostaPedido))
    preencherPedidoValido()

    expect(component.pedidoForm.valid).toBe(true)

    await component.criarPedido()

    expect(pedidoService.criarPedido).toHaveBeenCalledWith({
      clienteId: "123",
      enderecoEntrega: {
        rua: "Rua A",
        numero: "123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "12345-678",
        nomeDestinatario: "João",
        telefoneDestinatario: "(11) 98765-4321",
        complemento: "",
      },
      itens: [{ nome: "Produto", quantidade: 2, preco: 50 }],
      valorEntrega: 10,
      status: "preparando",
    })
    expect(pedidoCriadoSpy).toHaveBeenCalledWith(respostaPedido)
    expect(erroSpy).not.toHaveBeenCalled()
    expect(component.carregando).toBe(false)
    expect(component.itens.length).toBe(1)
    expect(component.pedidoForm.get("clienteId")?.value).toBe("")
  })

  it("deve emitir erro e manter o formulário quando a API falhar", async () => {
    const erroSpy = vi.spyOn(component.erro, "emit")
    const pedidoCriadoSpy = vi.spyOn(component.pedidoCriado, "emit")
    pedidoService.criarPedido.mockReturnValue(throwError(() => new Error("Não foi possível criar o pedido")))
    preencherPedidoValido()

    await component.criarPedido()

    expect(erroSpy).toHaveBeenCalledWith("Não foi possível criar o pedido")
    expect(pedidoCriadoSpy).not.toHaveBeenCalled()
    expect(component.carregando).toBe(false)
    expect(component.pedidoForm.get("clienteId")?.value).toBe("123")
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
