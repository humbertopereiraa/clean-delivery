import HTTP from "../../../domain/abstracoes/aHttp"

export = (servidor: HTTP) => {
  servidor.on('/info', 'get', () => 'API AUTH SERVICE ATIVO')
}