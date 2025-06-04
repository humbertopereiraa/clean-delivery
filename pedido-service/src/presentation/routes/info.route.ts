import HTTP from "../../domain/abstracoes/aHttp"
import { infoRouteSchema } from "../../infra/schemas/info.schema"

export = (servidor: HTTP) => {
  servidor.on('/info', 'get', () => 'API PEDIDO SERVICE ATIVO', infoRouteSchema)
}