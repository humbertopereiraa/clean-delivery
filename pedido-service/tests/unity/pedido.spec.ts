import EnderecoEntrega from '../../src/domain/entities/enderecoEntrega'
import ItensPedido from '../../src/domain/entities/itensPedido'
import Pedido, { PedidoStatus } from '../../src/domain/entities/pedido'
import PedidoError from '../../src/domain/errors/pedidoError'

describe('Pedido', () => {

  const testeCases = ['', '   ', null as any, undefined as any]
  const id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  const clienteId = 'c1c2c3c4-d5d6-7890-1234-567890fedcba'
  const valorEntrega = 15.50
  const status: PedidoStatus = 'preparando'
  const criadoEm = new Date()
  const atualizadoEm = new Date()

  let enderecoEntregaMock: EnderecoEntrega
  let itensPedidoMock: ItensPedido[]

  beforeEach(() => {
    jest.clearAllMocks()

    enderecoEntregaMock = {
      id: 'any_id',
      rua: 'Rua Mock',
      numero: '123',
      bairro: 'Bairro Mock',
      cidade: 'Cidade Mock',
      estado: 'MG',
      cep: { value: '00.000-000' } as any,
      nomeDestinatario: 'any_nome',
      telefoneDestinatario: { value: '00000000000' } as any
    } as EnderecoEntrega

    itensPedidoMock = [
      {
        id: 'mock-item-id-1',
        pedidoId: id,
        nome: 'Item Mock 1',
        quantidade: 1,
        preco: 10.00,
        total: 10.00,
      } as ItensPedido,
      {
        id: 'mock-item-id-2',
        pedidoId: id,
        nome: 'Item Mock 2',
        quantidade: 2,
        preco: 5.00,
        total: 10.00,
      } as ItensPedido
    ]
  })

  it('Deve criar uma instância válida de Pedido com todas as propriedades: ', () => {
    const sut = new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, criadoEm, atualizadoEm)

    expect(sut).toBeInstanceOf(Pedido)
    expect(sut.id).toBe(id)
    expect(sut.clienteId).toBe(clienteId)
    expect(sut.enderecoEntrega).toBe(enderecoEntregaMock)
    expect(sut.itens).toBe(itensPedidoMock)
    expect(sut.valorEntrega).toBe(valorEntrega)
    expect(sut.status).toBe(status)
    expect(sut.criadoEm).toBe(criadoEm)
    expect(sut.atualizadoEm).toBe(atualizadoEm)
  })

  it('Deve normalizar (trim) as propriedades string no construtor: ', () => {
    const sut = new Pedido(`  ${id}  `, `  ${clienteId}  `, enderecoEntregaMock, itensPedidoMock, valorEntrega, status)
    expect(sut.id).toBe(id)
    expect(sut.clienteId).toBe(clienteId)
  })

  it('Deve lançar PedidoError se o ID do pedido for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new Pedido(item, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, criadoEm, atualizadoEm)).toThrow(PedidoError)
    })
  })

  it('Deve lançar PedidoError se o ID do cliente for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new Pedido(id, item, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, criadoEm, atualizadoEm)).toThrow(PedidoError)
    })
  })

  it('Deve lançar PedidoError se o endereço de entrega for nulo, indefinido ou inválido: ', () => {
    const enderecoEntregaInvalido = [null as any, undefined as any, {} as EnderecoEntrega]
    enderecoEntregaInvalido.forEach(item => {
      expect(() => new Pedido(id, clienteId, item, itensPedidoMock, valorEntrega, status, criadoEm, atualizadoEm)).toThrow(PedidoError)
    })
  })

  it('Deve lançar PedidoError se a lista de itens for nula, indefinida, vazia ou não for um array: ', () => {
    const itensInvalidos = [null as any, undefined as any, [], 'nao-e-array' as any]
    itensInvalidos.forEach(item => {
      expect(() => new Pedido(id, clienteId, enderecoEntregaMock, item, valorEntrega, status, criadoEm, atualizadoEm)).toThrow(PedidoError)
    })
  })

  it('Deve lançar PedidoError se o valor de entrega for negativo ou inválido: ', () => {
    const valoresEntregaInvalidos = [-0.01, -10, null as any, undefined as any, NaN, 'abc' as any]
    valoresEntregaInvalidos.forEach(item => {
      expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, item, status, criadoEm, atualizadoEm)).toThrow(PedidoError)
    })
  })

  it('Deve lançar PedidoError se o status for inválido: ', () => {
    const statusInvalido = 'status_invalido' as PedidoStatus
    expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, statusInvalido, criadoEm, atualizadoEm)).toThrow(PedidoError)
  })

  it('Deve lançar PedidoError se a data de criação for inválida: ', () => {
    const dataInvalida = 'data_invalida' as any
    expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, dataInvalida, atualizadoEm)).toThrow(PedidoError)
    const objetoDataInvalido = new Date('invalid date')
    expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, objetoDataInvalido, atualizadoEm)).toThrow(PedidoError)
  })

  it('Deve lançar PedidoError se a data de atualização for inválida: ', () => {
    const dataInvalida = 'data_invalida' as any
    expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, criadoEm, dataInvalida)).toThrow(PedidoError)
    const objetoDataInvalido = new Date('invalid date')
    expect(() => new Pedido(id, clienteId, enderecoEntregaMock, itensPedidoMock, valorEntrega, status, criadoEm, objetoDataInvalido)).toThrow(PedidoError)
  })
})