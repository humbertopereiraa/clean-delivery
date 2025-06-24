import UsuarioEventListener from "../application/eventListeners/usuarioEventListener"
import { ExpressSwaggerAdapter } from "../infra/documentation/expressSwaggerAdapter"
import SwaggerDocumentation from "../infra/documentation/swaggerDocumentation"
import { DomainErrorStatusResolver } from "../infra/http/domainErrorStatusResolver"
import { ExpressAdapter } from "../infra/http/expressAdapter"
import WinstonLoggerAdapter from "../infra/log/winstonLoggerAdapter"
import RabbitMQAdapter from "../infra/messaging/rabbitMQAdapter"
import obterRabbitMQConfiguracao from "../infra/messaging/rabbitMQConfig"
import { Configuracao } from "./configuracao"

export async function startServer() {
  //Criar Servidor
  const domainErrorStatusResolver = new DomainErrorStatusResolver()
  const servidor = new ExpressAdapter(domainErrorStatusResolver)

  //Configurar documentação ANTES de carregar as rota
  const swaggerDocumentation = new SwaggerDocumentation()
  const expressSwaggerAdapter = new ExpressSwaggerAdapter()
  await servidor.configurarDocumentacaoRotas(expressSwaggerAdapter, swaggerDocumentation)

  //Carregar Rotas
  servidor.carregarRotas(servidor)

  //Criar conexão com Mensageria
  const logger = new WinstonLoggerAdapter()
  const rabbitMQ = RabbitMQAdapter.getInstance(obterRabbitMQConfiguracao(), logger)

  //Escutar eventos Mensageria
  const usuarioEventListener = new UsuarioEventListener(rabbitMQ, logger)
  await usuarioEventListener.iniciar()

  //Inicializar Servidor
  servidor.listen(Configuracao.http.port)
}