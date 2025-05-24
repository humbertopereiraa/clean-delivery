import HTTP from "../../domain/abstracoes/aHttp"
import { infoRouteSchema } from "../schemas/info.schema"

export = (servidor: HTTP) => {
  servidor.on('/info', 'get', () => 'API AUTH SERVICE ATIVO', infoRouteSchema)
}