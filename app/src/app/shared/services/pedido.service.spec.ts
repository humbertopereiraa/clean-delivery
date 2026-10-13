import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { HttpErrorResponse, type HttpClient } from '@angular/common/http'
import { firstValueFrom, of, throwError, type Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import {
  PedidoService,
  type PedidoRequest,
  type PedidoResponse,
} from './pedido.service'

interface CorpoPedido {
  clienteId: string
  enderecoEntrega: PedidoRequest['enderecoEntrega']
  itens: PedidoRequest['itens']
  valorEntrega: number
  status: string
}

interface HttpPedidoMock {
  post: Mock<(url: string, corpo: CorpoPedido) => Observable<PedidoResponse>>
}

const pedido: PedidoRequest = {
  clienteId: 'cliente-1',
  enderecoEntrega: {
    rua: 'Rua A',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '12345-678',
    nomeDestinatario: 'João',
    telefoneDestinatario: '(11) 98765-4321',
  },
  itens: [{ nome: 'Produto', quantidade: 2, preco: 50 }],
  valorEntrega: 10,
  status: 'preparando',
}

const pedidoCriado: PedidoResponse = {
  id: 'pedido-1',
  total: '110.00',
  status: 'preparando',
  criadoEm: '2026-10-12T21:00:00.000Z',
  enderecoEntrega: {
    id: 'endereco-1',
    ...pedido.enderecoEntrega,
  },
  itens: [{
    id: 'item-1',
    pedidoId: 'pedido-1',
    nome: 'Produto',
    quantidade: 2,
    preco: '50.00',
  }],
}

describe('PedidoService', () => {
  let service: PedidoService
  let http: HttpPedidoMock

  beforeEach(() => {
    http = {
      post: vi.fn<(url: string, corpo: CorpoPedido) => Observable<PedidoResponse>>(),
    }

    service = new PedidoService(http as unknown as HttpClient)
  })

  it('deve criar o pedido na API de pedidos', async () => {
    http.post.mockReturnValue(of(pedidoCriado))

    const resultado = await firstValueFrom(service.criarPedido(pedido))

    expect(http.post).toHaveBeenCalledWith(`${environment.apiPedidoUrl}/pedido`, pedido)
    expect(resultado).toEqual(pedidoCriado)
  })

  it('deve propagar o erro quando a API recusar o pedido', async () => {
    const erro = new HttpErrorResponse({
      status: 422,
      error: { erro: 'CEP inválido' },
    })
    http.post.mockReturnValue(throwError(() => erro))

    await expect(firstValueFrom(service.criarPedido(pedido))).rejects.toBe(erro)
    expect(http.post).toHaveBeenCalledWith(`${environment.apiPedidoUrl}/pedido`, pedido)
  })
})
