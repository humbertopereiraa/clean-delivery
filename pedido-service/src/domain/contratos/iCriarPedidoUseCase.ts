import { ICriarPedidoInputDTO } from "../../aplication/dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../../aplication/dtos/iCriarPedidoOutputDTO"

export interface ICriarPedidoUseCase {
  execute(input: ICriarPedidoInputDTO): Promise<ICriarPedidoOutputDTO>
}
