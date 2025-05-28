import { ICriarPedidoInputDTO } from "../../aplication/dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../../aplication/dtos/iCriarPedidoOutputDTO"

export interface ICriarPedido {
  execute(input: ICriarPedidoInputDTO): Promise<ICriarPedidoOutputDTO>
}
