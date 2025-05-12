import FastifySwaggerAdapter from "../infra/documentation/fastifySwagger"
import SwaggerDocumentation from "../infra/documentation/swaggerDocumentation"
import { FastifyAdapter } from "../infra/http/fastifyAdapter"
import { Configuracao } from "./configuracao"

export async function bootstrap() {

  //Criar Servidor
  const swaggerDocumentation = new SwaggerDocumentation()
  const fastifySwaggerAdapter = new FastifySwaggerAdapter()
  const servidor = new FastifyAdapter()

  //Carregar Rotas
  await servidor.configuraDocumentacaoRotas(fastifySwaggerAdapter, swaggerDocumentation)
  servidor.carregarRotas(servidor)

  //Inicializar Servidor
  await servidor.listen(Configuracao.http.port)
}