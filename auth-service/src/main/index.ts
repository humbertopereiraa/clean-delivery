import { FastifyAdapter } from "../infra/http/fastifyAdapter"
import { Configuracao } from "./configuracao"

const servidor = new FastifyAdapter()

servidor.carregarRotas(servidor)
servidor.listen(Configuracao.http.port)
