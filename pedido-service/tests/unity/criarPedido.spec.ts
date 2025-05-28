import { IPedidoRepository } from '../../src/domain/repositories/iPedidoRepository'
import { IUnitOfWork } from '../../src/domain/contratos/iUnitOfWork'
import { IUuid } from '../../src/domain/contratos/iUuid'
import { ICriarPedido } from '../../src/domain/contratos/iCriarPedido'
import CriarPedido from '../../src/aplication/useCases/criarPedido'
import { ICriarPedidoInputDTO } from '../../src/aplication/dtos/iCriarPedidoInputDTO'
import Pedido from '../../src/domain/entities/pedido'
import EnderecoEntrega from '../../src/domain/entities/enderecoEntrega'
import CEP from '../../src/domain/valueOBjects/cep'
import Telefone from '../../src/domain/valueOBjects/telefone'
import ItensPedido from '../../src/domain/entities/itensPedido'

describe('CriarPedido', () => {
  let pedidoRepositoryMock: jest.Mocked<IPedidoRepository>
  let unitOfWorkMock: jest.Mocked<IUnitOfWork>
  let uuidMock: jest.Mocked<IUuid>
  let criarPedido: ICriarPedido

  const dto = {
    clienteId: 'cliente-1',
    endereco: {
      rua: 'any_rua',
      numero: 'any_numero',
      bairro: 'any_bairro',
      cidade: 'any_cidade',
      estado: 'ES',
      cep: '29.101-460',
      nomeDestinatario: 'any_nomeDestinatario',
      telefoneDestinatario: '27999999999'
    },
    itens: [{ pedidoId: 'any_id', nome: 'any_nome', quantidade: 2, preco: 15.50 }],
    valorEntrega: 5.00
  } as ICriarPedidoInputDTO

  beforeEach(() => {
    pedidoRepositoryMock = {
      salvar: jest.fn()
    }

    unitOfWorkMock = {
      start: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      getConnection: jest.fn()
    }

    uuidMock = {
      gerar: jest.fn().mockReturnValue('any_id')
    }

    criarPedido = new CriarPedido(pedidoRepositoryMock, unitOfWorkMock, uuidMock)
  })

  it('Deve criar e salvar um pedido com sucesso: ', async () => {
    const enderecoMock = new EnderecoEntrega(
      'any_id', 'any_id',
      dto.endereco.rua,
      dto.endereco.numero,
      dto.endereco.bairro,
      dto.endereco.cidade,
      dto.endereco.estado,
      CEP.create(dto.endereco.cep),
      dto.endereco.nomeDestinatario,
      Telefone.create(dto.endereco.telefoneDestinatario)
    )
    const itensPedidoMock = [new ItensPedido('any_id', 'any_id', dto.itens[0].nome, dto.itens[0].quantidade, dto.itens[0].preco)]
    const pedidoMock = new Pedido('any_id', 'cliente-1', enderecoMock, itensPedidoMock, dto.valorEntrega, 'preparando')

    pedidoRepositoryMock.salvar.mockResolvedValue(pedidoMock)

    const sut = await criarPedido.execute(dto)

    expect(sut.id).toBe('any_id')
    expect(sut.status).toBe('preparando')
    expect(sut.total).toBe(36)

    expect(unitOfWorkMock.start).toHaveBeenCalled()
    expect(pedidoRepositoryMock.salvar).toHaveBeenCalled()
    expect(unitOfWorkMock.commit).toHaveBeenCalled()
    expect(unitOfWorkMock.rollback).not.toHaveBeenCalled()
  })

  it('Deve fazer rollback se salvar falhar: ', async () => {
    pedidoRepositoryMock.salvar.mockRejectedValueOnce(new Error('Erro ao salvar'))

    await expect(criarPedido.execute(dto)).rejects.toThrow('Erro ao salvar')
    expect(unitOfWorkMock.start).toHaveBeenCalled()
    expect(pedidoRepositoryMock.salvar).toHaveBeenCalled()
    expect(unitOfWorkMock.commit).not.toHaveBeenCalled()
    expect(unitOfWorkMock.rollback).toHaveBeenCalled()
  })
})