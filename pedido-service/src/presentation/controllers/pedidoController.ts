import { ICriarPedidoInputDTO } from "../../aplication/dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../../aplication/dtos/iCriarPedidoOutputDTO"
import { ICriarPedidoUseCase } from "../../domain/contratos/iCriarPedidoUseCase"

interface IRequestCriarPedido {
  body: {
    clienteId: string,
    endereco: {
      rua: string,
      numero: string,
      bairro: string,
      cidade: string,
      estado: string,
      cep: string,
      complemento: string,
      nomeDestinatario: string,
      telefoneDestinatario: string
    },
    itens: {
      nome: string
      quantidade: number
      preco: number
    }[],
    valorEntrega: number
  }
}

export class PedidoController {

  constructor(private criarPedidoUseCase: ICriarPedidoUseCase) { }

  public async criar(req: IRequestCriarPedido): Promise<ICriarPedidoOutputDTO> {
    try {
      const body = req.body
      const input: ICriarPedidoInputDTO = {
        clienteId: body?.clienteId,
        endereco: {
          rua: body?.endereco?.rua,
          numero: body?.endereco?.numero,
          bairro: body?.endereco?.bairro,
          cidade: body?.endereco?.cidade,
          estado: body?.endereco?.estado,
          cep: body?.endereco?.cep,
          complemento: body?.endereco?.complemento,
          nomeDestinatario: body?.endereco?.nomeDestinatario,
          telefoneDestinatario: body?.endereco?.telefoneDestinatario,
        },
        itens: body?.itens?.map(item => {
          return {
            ...item,
            quantidade: typeof item?.quantidade === 'string' ? parseInt(item.quantidade) : item?.quantidade,
            preco: typeof item?.preco === 'string' ? parseFloat(item.preco) : item?.preco
          }
        }) ?? [],
        valorEntrega: typeof body?.valorEntrega === 'string' ? parseFloat(body.valorEntrega) : body?.valorEntrega
      }
      const output = await this.criarPedidoUseCase.execute(input)
      return output
    } catch (error) {
      //TODO: Add logger
      throw error
    }
  }
}
