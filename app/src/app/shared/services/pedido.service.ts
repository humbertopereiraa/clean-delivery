import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnderecoEntregaPedido {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  nomeDestinatario: string;
  telefoneDestinatario: string;
  complemento?: string;
}

export interface ItemPedido {
  nome: string;
  quantidade: number;
  preco: number;
}

export interface PedidoRequest {
  clienteId: string;
  enderecoEntrega: EnderecoEntregaPedido;
  itens: ItemPedido[];
  valorEntrega: number;
  status: string;
}

export interface EnderecoEntregaResponse extends EnderecoEntregaPedido {
  id: string;
}

export interface ItemPedidoResponse {
  id: string;
  pedidoId: string;
  nome: string;
  quantidade: number;
  preco: string;
}

export interface PedidoResponse {
  id: string;
  total: string;
  status: string;
  criadoEm: string;
  enderecoEntrega: EnderecoEntregaResponse;
  itens: ItemPedidoResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly API = environment.apiPedidoUrl;

  constructor(private http: HttpClient) { }

  public criarPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.API}/pedido`, pedido);
  }
}
