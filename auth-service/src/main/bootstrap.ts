import FastifySwaggerAdapter from "../infra/documentation/fastifySwaggerAdapter"
import SwaggerDocumentation from "../infra/documentation/swaggerDocumentation"
import { DomainErrorStatusResolver } from "../infra/http/domainErrorStatusResolver"
import { FastifyAdapter } from "../infra/http/fastifyAdapter"
import { Configuracao } from "./configuracao"

export async function bootstrap() {

  //Criar Servidor
  const swaggerDocumentation = new SwaggerDocumentation()
  const domainErrorStatusResolver = new DomainErrorStatusResolver()
  const fastifySwaggerAdapter = new FastifySwaggerAdapter()
  const servidor = new FastifyAdapter(domainErrorStatusResolver)

  //Carregar Rotas
  await servidor.configurarDocumentacaoRotas(fastifySwaggerAdapter, swaggerDocumentation)
  await servidor.carregarRotas(servidor)

  //Inicializar Servidor
  await servidor.listen(Configuracao.http.port)
}