import { ExpressSwaggerAdapter } from "../infra/documentation/expressSwaggerAdapter"
import SwaggerDocumentation from "../infra/documentation/swaggerDocumentation"
import { DomainErrorStatusResolver } from "../infra/http/domainErrorStatusResolver"
import { ExpressAdapter } from "../infra/http/expressAdapter"
import { Configuracao } from "./configuracao"

export async function bootstrap() {
  //Criar Servidor
  const domainErrorStatusResolver = new DomainErrorStatusResolver()
  const servidor = new ExpressAdapter(domainErrorStatusResolver)

  // Configurar documentação ANTES de carregar as rota
  const swaggerDocumentation = new SwaggerDocumentation()
  const expressSwaggerAdapter = new ExpressSwaggerAdapter()
  await servidor.configurarDocumentacaoRotas(expressSwaggerAdapter, swaggerDocumentation)

  //Carregar Rotas
  servidor.carregarRotas(servidor)

  //Inicializar Servidor
  servidor.listen(Configuracao.http.port)
}