import ItensPedido from '../../src/domain/entities/itensPedido'
import ItensPedidoError from '../../src/domain/errors/itensPedidoError'

describe('ItensPedido', () => {

  const testeCases = ['', '   ', null as any, undefined as any]
  const id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  const pedidoId = 'f1e2d3c4-b5a6-9876-5432-10fedcba9876'
  const nome = 'Camiseta Branca'
  const quantidade = 2
  const preco = 49.90

  it('Deve criar uma instância válida de ItensPedido: ', () => {
    const sut = new ItensPedido(id, pedidoId, nome, quantidade, preco)
    expect(sut).toBeInstanceOf(ItensPedido)
    expect(sut.id).toBe(id);
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.nome).toBe(nome)
    expect(sut.quantidade).toBe(quantidade)
    expect(sut.preco).toBe(preco)
  })

  it('Deve normalizar (trim) as propriedades string no construtor: ', () => {
    const sut = new ItensPedido(`  ${id}  `, `  ${pedidoId}  `, `  ${nome}  `, quantidade, preco)
    expect(sut).toBeInstanceOf(ItensPedido)
    expect(sut.id).toBe(id);
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.nome).toBe(nome)
    expect(sut.quantidade).toBe(quantidade)
    expect(sut.preco).toBe(preco)
  })

  it('Deve calcular o total corretamente: ', () => {
    const quantidade = 3
    const preco = 25.50
    const sut = new ItensPedido(id, pedidoId, nome, quantidade, preco)
    expect(sut.total).toBe(quantidade * preco)
  })

  it('Deve calcular o total corretamente mesmo com preço zero: ', () => {
    const quantidade = 5
    const preco = 0
    const sut = new ItensPedido(id, pedidoId, nome, quantidade, preco)
    expect(sut.total).toBe(0)
  })

  it('Deve lançar ItensPedidoError se o ID do item de pedido for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new ItensPedido(item, pedidoId, nome, quantidade, preco)).toThrow(ItensPedidoError)
    })
  })

  it('Deve lançar ItensPedidoError se o ID do pedido for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new ItensPedido(id, item, nome, quantidade, preco)).toThrow(ItensPedidoError)
    })
  })

  it('Deve lançar ItensPedidoError se o nome for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new ItensPedido(id, pedidoId, item, quantidade, preco)).toThrow(ItensPedidoError)
    })
  })

  it('Deve lançar ItensPedidoError se a quantidade não for um número maior que zero: ', () => {
    const quantidesInvalidas = [0, -1, null as any, undefined as any, NaN, 'abc' as any]
    quantidesInvalidas.forEach(item => {
      expect(() => new ItensPedido(id, pedidoId, nome, item, preco)).toThrow(ItensPedidoError)
    })
  })

  it('Deve lançar ItensPedidoError se o preço não for um número não negativo: ', () => {
    const precosinvalidos = [-0.01, -10, null as any, undefined as any, NaN, 'xyz' as any]
    precosinvalidos.forEach(item => {
      expect(() => new ItensPedido(id, pedidoId, nome, quantidade, item)).toThrow(ItensPedidoError)
    })
  })
})