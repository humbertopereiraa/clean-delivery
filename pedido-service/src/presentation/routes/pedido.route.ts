import CriarPedidoUseCase from "../../aplication/useCases/criarPedidoUseCase"
import HttpServer from "../../domain/abstracoes/aHttp"
import { KnexConexaoAdapter } from "../../infra/database/knexConexaoAdapter"
import { UnitOfWork } from "../../infra/database/unitOfWork"
import { PedidoRepository } from "../../infra/repositories/pedidoRepository"
import { criarPedidoSchema } from "../../infra/schemas/criarPedido.schema"
import { uuid } from "../../infra/token/uuid"
import { PedidoController } from "../controllers/pedidoController"

const conexao = new KnexConexaoAdapter()
const unitOfWork = new UnitOfWork(conexao)
const pedidoRepository = new PedidoRepository(unitOfWork)
const criarPedidoUseCase = new CriarPedidoUseCase(pedidoRepository, unitOfWork, uuid)
const pedidoController = new PedidoController(criarPedidoUseCase)

export = (servidor: HttpServer) => {
  servidor.on('/pedido', 'post', pedidoController.criar.bind(pedidoController), criarPedidoSchema)
}