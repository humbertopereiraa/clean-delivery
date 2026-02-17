import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from "@angular/core"
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from "@angular/forms"
import { NgWizardModule, NgWizardService } from "ng-wizard"

interface ItemPedido {
  nome: string
  quantidade: number
  preco: number
}

interface EnderecoEntrega {
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  nomeDestinatario: string
  telefoneDestinatario: string
  complemento?: string
}

interface PedidoRequest {
  clienteId: string
  enderecoEntrega: EnderecoEntrega
  itens: ItemPedido[]
  valorEntrega: number
  status: string
}

@Component({
  selector: "app-cadastro-pedido",
  templateUrl: "./cadastro-pedido.component.html",
  styleUrls: ["./cadastro-pedido.component.css"],
  standalone: false,
})
export class CadastroPedidoComponent implements OnInit, OnChanges {
  @Input() resetForm: boolean = false;

  @Output() pedidoCriado = new EventEmitter<any>()
  @Output() erro = new EventEmitter<string>()

  public pedidoForm!: FormGroup
  public carregando = false

  constructor(private readonly fb: FormBuilder, private readonly wizardService: NgWizardService) { }

  ngOnInit() {
    this.inicializarFormulario()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['resetForm']?.currentValue) {
      this.resetarFormulario();
      this.wizardService.reset();
    }
  }

  get enderecoEntrega() {
    return this.pedidoForm.get("enderecoEntrega") as FormGroup
  }

  get itens() {
    return this.pedidoForm.get("itens") as FormArray
  }

  get infobasicas() {
    return this.pedidoForm.get('valorEntrega') as FormGroup
  }

  public validarEtapaItens(): boolean {
    const valid = this.itens.valid;
    if (!valid) this.itens.markAllAsTouched();
    return valid;
  }

  public validarEtapaEndereco(): boolean {
    const valid = this.enderecoEntrega.valid;
    if (!valid) this.enderecoEntrega.markAllAsTouched();
    return valid;
  }

  public validarEtapaInfoBasicas(): boolean {
    const valid = this.infobasicas.valid;
    if (!valid) this.infobasicas.markAsTouched();
    return valid;
  }

  public adicionarItem(): void {
    this.itens.push(this.criarItemFormGroup())
  }

  public removerItem(index: number) {
    if (this.itens.length > 1) {
      this.itens.removeAt(index)
    }
  }

  public calcularTotalItem(index: number): number {
    const item = this.itens.at(index)
    const quantidade = item.get("quantidade")?.value || 0
    const preco = item.get("preco")?.value || 0
    return quantidade * preco
  }

  public calcularSubtotal(): number {
    let subtotal = 0
    for (let i = 0; i < this.itens.length; i++) {
      subtotal += this.calcularTotalItem(i)
    }
    return subtotal
  }

  public calcularTotal(): number {
    const subtotal = this.calcularSubtotal()
    const valorEntrega = this.pedidoForm.get("valorEntrega")?.value || 0
    return subtotal + valorEntrega
  }

  public formatarCEP(event: any): void {
    let valor = event.target.value.replace(/\D/g, "")
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, "$1-$2")
    }
    event.target.value = valor
    this.enderecoEntrega.get("cep")?.setValue(valor)
  }

  public formatarTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, "")
    if (valor.length <= 11) {
      if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d)/, "($1) $2-$3")
      } else {
        valor = valor.replace(/^(\d{2})(\d{5})(\d)/, "($1) $2-$3")
      }
    }
    event.target.value = valor
    this.enderecoEntrega.get("telefoneDestinatario")?.setValue(valor)
  }

  public formatarEstado(event: any): void {
    const valor = event.target.value.toUpperCase()
    event.target.value = valor
    this.enderecoEntrega.get("estado")?.setValue(valor)
  }

  public async criarPedido(): Promise<void> {
    if (!this.itens.valid || !this.enderecoEntrega.valid || !this.infobasicas.valid) {
      return;
    }

    this.carregando = true

    try {
      const formValue = this.pedidoForm.getRawValue()
      const pedidoData: PedidoRequest = {
        clienteId: formValue.clienteId,
        enderecoEntrega: formValue.enderecoEntrega,
        itens: formValue.itens,
        valorEntrega: formValue.valorEntrega,
        status: "preparando",
      }

      // const response = await this.http.post("/api/pedidos", pedidoData).toPromise()

      // this.pedidoCriado.emit(response)
      this.resetarFormulario()
    } catch (error: any) {
      this.erro.emit(error.message || "Erro ao criar pedido")
    } finally {
      this.carregando = false
    }
  }

  public isFieldInvalid(fieldName: string, parentGroup?: AbstractControl): boolean {
    const group = parentGroup || this.pedidoForm
    const field = group.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  public getFieldError(fieldName: string, parentGroup?: AbstractControl): string {
    const group = parentGroup || this.pedidoForm
    const field = group.get(fieldName)

    if (field && field.errors) {
      if (field.errors["required"]) return "Este campo é obrigatório"
      if (field.errors["min"]) return `Valor mínimo: ${field.errors["min"].min}`
      if (field.errors["pattern"]) {
        if (fieldName === "cep") return "CEP deve ter formato 00000-000"
        if (fieldName === "telefoneDestinatario") return "Telefone deve ter formato (00) 00000-0000"
        if (fieldName === "estado") return "Estado deve ter 2 letras (ex: SP, RJ)"
      }
    }

    return ""
  }

  private inicializarFormulario(): void {
    this.pedidoForm = this.fb.group({
      clienteId: ["", [Validators.required]],
      valorEntrega: [null, [Validators.required, Validators.min(0)]],
      status: [{ value: "preparando", disabled: true }],
      enderecoEntrega: this.fb.group({
        rua: ["", [Validators.required]],
        numero: ["", [Validators.required]],
        bairro: ["", [Validators.required]],
        cidade: ["", [Validators.required]],
        estado: ["", [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
        cep: ["", [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
        nomeDestinatario: ["", [Validators.required]],
        telefoneDestinatario: ["", [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
        complemento: [""],
      }),
      itens: this.fb.array([this.criarItemFormGroup()]),
    })
  }

  private criarItemFormGroup(): FormGroup {
    return this.fb.group({
      nome: ["", [Validators.required]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      preco: [0, [Validators.required, Validators.min(0)]],
    })
  }

  private resetarFormulario(): void {
    this.pedidoForm.reset()
    this.inicializarFormulario()
  }
}
