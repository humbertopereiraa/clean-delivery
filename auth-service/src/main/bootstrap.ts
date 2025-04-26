import { FastifyAdapter } from "../infra/http/fastifyAdapter"
import { JwtTokenAdapter } from "../infra/token/jwtTokenAdapter"
import { Configuracao } from "./configuracao"

export async function bootstrap() {

  //Criar Servidor
  const jwtTokenAdapter = new JwtTokenAdapter()
  const servidor = new FastifyAdapter(jwtTokenAdapter)

  //Carregar Rotas
  servidor.carregarRotas(servidor)

  //Inicializar Servidor
  await servidor.listen(Configuracao.http.port)
}