import { IPedidoRepository } from "../../src/domain/repositories/iPedidoRepository"
import { IEntregaRepository } from "../../src/domain/repositories/iEntregaRepository"
import { IUnitOfWork } from "../../src/domain/contratos/iUnitOfWork"
import { IUuid } from "../../src/domain/contratos/iUuid"
import { IValidator } from "../../src/domain/contratos/iValidator"
import { IAceitarEntregaInputDTO } from '../../src/application/dtos/iAceitarEntregaInputDTO'
import ZodValidatorAdapter from "../../src/infra/validators/zodValidatorAdapter"
import Pedido, { NPedido } from "../../src/domain/entities/pedido"
import { IAceitarEntregaUseCase } from '../../src/domain/contratos/iAceitarEntregaUseCase'
import AceitarEntregaUseCase from '../../src/application/useCases/aceitarEntregaUseCase'
import Entrega from "../../src/domain/entities/entrega"

describe('AceitarEntrega', () => {
  let pedidoRepositoryMock: jest.Mocked<IPedidoRepository>
  let entregaRepositoryMock: jest.Mocked<IEntregaRepository>
  let unitOfWorkMock: jest.Mocked<IUnitOfWork>
  let uuidMock: jest.Mocked<IUuid>
  let validator: IValidator<IAceitarEntregaInputDTO>
  let aceitarEntregaUseCase: IAceitarEntregaUseCase

  const input: IAceitarEntregaInputDTO = {
    pedidoId: 'pedido-123',
    entregadorId: 'entregador-456'
  }

  const pedidoMock = {
    id: 'pedido-123',
    clienteId: 'cliente-789',
    status: 'pronto',
    enderecoEntrega: {} as any,
    itens: [{}] as any,
    valorEntrega: 10,
    criadoEm: new Date(),
    atualizadoEm: new Date()
  } as Pedido

  beforeEach(() => {
    pedidoRepositoryMock = {
      buscarPorId: jest.fn()
    } as any

    entregaRepositoryMock = {
      buscarPorPedidoId: jest.fn().mockResolvedValue(null),
      salvar: jest.fn().mockResolvedValue(undefined)
    } as any

    unitOfWorkMock = {
      start: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      getConnection: jest.fn()
    }

    uuidMock = {
      gerar: jest.fn().mockReturnValue('entrega-uuid')
    }

    validator = new ZodValidatorAdapter()

    aceitarEntregaUseCase = new AceitarEntregaUseCase(pedidoRepositoryMock, entregaRepositoryMock, unitOfWorkMock, uuidMock, validator)
  })

  it('Deve aceitar uma entrega com sucesso: ', async () => {
    pedidoRepositoryMock.buscarPorId.mockResolvedValue(pedidoMock)
    const sut = await aceitarEntregaUseCase.execute(input)

    expect(unitOfWorkMock.start).toHaveBeenCalled()
    expect(pedidoRepositoryMock.buscarPorId).toHaveBeenCalledWith(input.pedidoId)
    expect(entregaRepositoryMock.buscarPorPedidoId).toHaveBeenCalledWith(input.pedidoId)
    expect(entregaRepositoryMock.salvar).toHaveBeenCalled()
    expect(unitOfWorkMock.commit).toHaveBeenCalled()

    expect(sut).toMatchObject({
      id: 'entrega-uuid',
      pedidoId: input.pedidoId,
      entregadorId: input.entregadorId,
      status: 'aceita',
    })
  })

  it('Deve lançar erro se o pedido não existir: ', async () => {
    pedidoRepositoryMock.buscarPorId.mockResolvedValueOnce(null)
    await expect(aceitarEntregaUseCase.execute(input)).rejects.toThrow('Pedido não encontrado.')
    expect(unitOfWorkMock.rollback).toHaveBeenCalled()
  })

  it('Deve lançar erro se o status do pedido não for "pronto": ', async () => {
    pedidoRepositoryMock.buscarPorId.mockResolvedValueOnce({
      ...pedidoMock,
      status: 'preparando' as NPedido.status
    } as any)

    await expect(aceitarEntregaUseCase.execute(input)).rejects.toThrow('Pedido não está pronto para ser aceito.')
    expect(unitOfWorkMock.rollback).toHaveBeenCalled()
  })

  it('Deve lançar erro se o pedido já tiver sido aceito: ', async () => {
    pedidoRepositoryMock.buscarPorId.mockResolvedValue(pedidoMock)
    entregaRepositoryMock.buscarPorPedidoId.mockResolvedValueOnce({} as Entrega)

    await expect(aceitarEntregaUseCase.execute(input)).rejects.toThrow('Este pedido já foi aceito.')
    expect(unitOfWorkMock.rollback).toHaveBeenCalled()
  })
})