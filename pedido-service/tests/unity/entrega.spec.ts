import Entrega, { EntregaStatus } from '../../src/domain/entities/entrega'
import EntregaError from '../../src/domain/errors/entregaError'

describe('Entrega', () => {
  const testCases = ['', '   ', null as any, undefined as any]
  const id = 'e1e2e3e4-1234-5678-9012-abcdefabcdef'
  const pedidoId = 'p1p2p3p4-1234-5678-9012-fedcbafedcba'
  const entregadorId = 'd1d2d3d4-1234-5678-9012-aaaabbbbcccc'
  const aceitaEm = new Date()
  const entregueEm = new Date()

  it('Deve criar uma instância válida de Entrega com status "aceita": ', () => {
    const sut = new Entrega(id, pedidoId, entregadorId, 'aceita', aceitaEm, undefined)

    expect(sut).toBeInstanceOf(Entrega)
    expect(sut.id).toBe(id)
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.entregadorId).toBe(entregadorId)
    expect(sut.status).toBe('aceita')
    expect(sut.aceitaEm).toBeInstanceOf(Date)
    expect(sut.entregueEm).toBeUndefined()
  })

  it('Deve criar uma entrega válida com status "entregue" e entregueEm definido: ', () => {
    const sut = new Entrega(id, pedidoId, entregadorId, 'entregue', aceitaEm, entregueEm)
    expect(sut.status).toBe('entregue')
    expect(sut.entregueEm).toBeInstanceOf(Date)
  })

  it('Deve lançar EntregaError se o ID estiver vazio ou inválido', () => {
    testCases.forEach(value => {
      expect(() => new Entrega(value, pedidoId, entregadorId, 'aceita', aceitaEm)).toThrow(EntregaError)
    })
  })

  it('Deve lançar EntregaError se o pedidoId estiver vazio ou inválido: ', () => {
    testCases.forEach(value => {
      expect(() => new Entrega(id, value, entregadorId, 'aceita', aceitaEm)).toThrow(EntregaError)
    })
  })

  it('Deve lançar EntregaError se o entregadorId estiver vazio ou inválido: ', () => {
    testCases.forEach(value => {
      expect(() => new Entrega(id, pedidoId, value, 'aceita', aceitaEm)).toThrow(EntregaError)
    })
  })

  it('Deve lançar EntregaError se o status for inválido: ', () => {
    expect(() =>
      new Entrega(id, pedidoId, entregadorId, 'cancelado' as EntregaStatus, aceitaEm)
    ).toThrow(EntregaError)
  })

  it('Deve lançar EntregaError se a data aceitaEm for inválida: ', () => {
    expect(() =>
      new Entrega(id, pedidoId, entregadorId, 'aceita', new Date('invalid-date'))
    ).toThrow(EntregaError)
  })

  it('Deve lançar EntregaError se o status for "entregue" e entregueEm for inválido: ', () => {
    expect(() =>
      new Entrega(id, pedidoId, entregadorId, 'entregue', aceitaEm, new Date('invalid-date'))
    ).toThrow(EntregaError)
  })

  it('Não deve lançar erro se entregueEm for undefined quando status != "entregue": ', () => {
    expect(() =>
      new Entrega(id, pedidoId, entregadorId, 'aceita', aceitaEm, undefined)
    ).not.toThrow()
  })
})  