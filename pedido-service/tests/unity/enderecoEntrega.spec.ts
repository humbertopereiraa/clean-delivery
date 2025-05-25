import CEP from '../../src/domain/valueOBjects/cep'
import Telefone from '../../src/domain/valueOBjects/telefone'
import EnderecoEntrega from '../../src/domain/entities/enderecoEntrega'
import EnderecoEntregaError from '../../src/domain/errors/enderecoEntregaError'

describe('EnderecoEntrega ', () => {

  let cepMock: jest.Mocked<CEP>
  let telefoneMock: jest.Mocked<Telefone>

  const testeCases = ['', '   ', null as any, undefined as any]
  const id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  const pedidoId = 'f1e2d3c4-b5a6-9876-5432-10fedcba9876'
  const rua = 'Rua Principal'
  const numero = '123'
  const bairro = 'Centro'
  const cidade = 'São Paulo'
  const estado = 'SP'
  const nomeDestinatario = 'João da Silva'
  const complemento = 'Apto 101'

  beforeEach(() => {
    jest.clearAllMocks()
    
    cepMock = {
      value: '29065-540'
    } as jest.Mocked<CEP>

    telefoneMock = {
      value: '2799999-9999'
    } as jest.Mocked<Telefone>
  })

  it('Deve criar uma instância válida de EnderecoEntrega com complemento: ', () => {
    const sut = new EnderecoEntrega(
      id,
      pedidoId,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cepMock,
      nomeDestinatario,
      telefoneMock,
      complemento
    )

    expect(sut).toBeInstanceOf(EnderecoEntrega)
    expect(sut.id).toBe(id)
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.rua).toBe(rua)
    expect(sut.numero).toBe(numero)
    expect(sut.bairro).toBe(bairro)
    expect(sut.cidade).toBe(cidade)
    expect(sut.estado).toBe(estado.toUpperCase())
    expect(sut.cep.value).toBe(cepMock.value)
    expect(sut.nomeDestinatario).toBe(nomeDestinatario)
    expect(sut.telefoneDestinatario.value).toBe(telefoneMock.value)
    expect(sut.complemento).toBe(complemento)
  })

    it('Deve criar uma instância válida de EnderecoEntrega sem complemento: ', () => {
    const sut = new EnderecoEntrega(
      id,
      pedidoId,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cepMock,
      nomeDestinatario,
      telefoneMock
    )

    expect(sut).toBeInstanceOf(EnderecoEntrega)
    expect(sut.id).toBe(id)
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.rua).toBe(rua)
    expect(sut.numero).toBe(numero)
    expect(sut.bairro).toBe(bairro)
    expect(sut.cidade).toBe(cidade)
    expect(sut.estado).toBe(estado.toUpperCase())
    expect(sut.cep.value).toBe(cepMock.value)
    expect(sut.nomeDestinatario).toBe(nomeDestinatario)
    expect(sut.telefoneDestinatario.value).toBe(telefoneMock.value)
    expect(sut.complemento).toBeUndefined()
  })

  it('Deve normalizar (trim e toUpperCase) as propriedades string no construtor: ', () => {
    const sut = new EnderecoEntrega(
      `  ${id}  `,
      `  ${pedidoId}  `,
      `  ${rua}  `,
      `  ${numero}  `,
      `  ${bairro}  `,
      `  ${cidade}  `,
      `  ${estado.toLowerCase()}  `,
      cepMock,
      `  ${nomeDestinatario}  `,
      telefoneMock,
      `  ${complemento}  `
    )

    expect(sut).toBeInstanceOf(EnderecoEntrega)
    expect(sut.id).toBe(id)
    expect(sut.pedidoId).toBe(pedidoId)
    expect(sut.rua).toBe(rua)
    expect(sut.numero).toBe(numero)
    expect(sut.bairro).toBe(bairro)
    expect(sut.cidade).toBe(cidade)
    expect(sut.estado).toBe(estado.toUpperCase())
    expect(sut.cep.value).toBe(cepMock.value)
    expect(sut.nomeDestinatario).toBe(nomeDestinatario)
    expect(sut.telefoneDestinatario.value).toBe(telefoneMock.value)
    expect(sut.complemento).toBe(complemento)
  })

  it('Deve lançar EnderecoEntregaError se o ID do endereço for nulo, indefenido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        item,
        pedidoId,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se a rua for nula, indefenida ou vazia: ', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        item,
        numero,
        bairro,
        cidade,
        estado,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se o número for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        item,
        bairro,
        cidade,
        estado,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se o bairro for nulo, indefinido ou vazio: ', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        numero,
        item,
        cidade,
        estado,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se a cidade for nula, indefinida ou vazia: ', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        numero,
        bairro,
        item,
        estado,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se o estado for nulo, indefinido ou vazio:', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        numero,
        bairro,
        cidade,
        item,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se o estado não for uma UF válida de 2 letras: ', () => {
    const estadosInvalidos = ['S', 'SPT', '12', ' @ ']
    estadosInvalidos.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        numero,
        bairro,
        cidade,
        item,
        cepMock,
        nomeDestinatario,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })

  it('Deve lançar EnderecoEntregaError se o nome do destinario for nulo, indefinido ou vazio:', () => {
    testeCases.forEach(item => {
      expect(() => new EnderecoEntrega(
        id,
        pedidoId,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cepMock,
        item,
        telefoneMock,
        complemento
      )).toThrow(EnderecoEntregaError)
    })
  })
})