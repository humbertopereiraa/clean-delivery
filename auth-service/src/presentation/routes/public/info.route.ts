import HTTP from "../../../infra/http/http"

export = (servidor: HTTP) => {
  servidor.on('/info', 'get', () => 'API AUTH SERVICE ATIVO')
}