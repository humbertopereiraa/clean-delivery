import { ICriarPedidoInputDTO } from "../../application/dtos/iCriarPedidoInputDTO"
import { ICriarPedidoOutputDTO } from "../../application/dtos/iCriarPedidoOutputDTO"

export interface ICriarPedidoUseCase {
  execute(input: ICriarPedidoInputDTO): Promise<ICriarPedidoOutputDTO>
}
