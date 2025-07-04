import CriarPedidoUseCase from "../../application/useCases/criarPedidoUseCase"
import HttpServer from "../../domain/abstracoes/aHttp"
import RedisAdapter from "../../infra/cache/redisAdapter"
import KnexConexaoAdapter from "../../infra/database/knexConexaoAdapter"
import UnitOfWork from "../../infra/database/unitOfWork"
import FetchHttpClient from "../../infra/http/fetchHttpClient"
import UsuarioHttpService from "../../infra/http/usuarioHttpService"
import WinstonLoggerAdapter from "../../infra/log/winstonLoggerAdapter"
import PedidoRepository from "../../infra/repositories/pedidoRepository"
import UsuarioRepository from "../../infra/repositories/usuarioRepository"
import { criarPedidoSchema } from "../../infra/schemas/criarPedido.schema"
import { uuid } from "../../infra/token/uuid"
import ZodValidatorAdapter from "../../infra/validators/zodValidatorAdapter"
import { Configuracao } from "../../main/configuracao"
import { PedidoController } from "../controllers/pedidoController"

export = async (servidor: HttpServer) => {
  const conexao = new KnexConexaoAdapter()
  const unitOfWork = new UnitOfWork(conexao)
  const logger = new WinstonLoggerAdapter()
  const pedidoRepository = new PedidoRepository(unitOfWork, logger)
  const validator = new ZodValidatorAdapter()
  const redisAdapter = await RedisAdapter.getInstance(Configuracao.banco_cache.url, logger)
  const fetchHttpClient = new FetchHttpClient()
  const usuarioHttpService = new UsuarioHttpService(fetchHttpClient, logger)
  const usuarioRepository = new UsuarioRepository(redisAdapter, logger, usuarioHttpService)
  const criarPedidoUseCase = new CriarPedidoUseCase(pedidoRepository, unitOfWork, uuid, usuarioRepository, validator)
  const pedidoController = new PedidoController(criarPedidoUseCase)
  servidor.on('/pedido', 'post', pedidoController.criar.bind(pedidoController), criarPedidoSchema)
}