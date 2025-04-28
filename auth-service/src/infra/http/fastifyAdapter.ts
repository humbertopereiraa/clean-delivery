import HTTP from "../../domain/abstracoes/aHttp"
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import helmet from '@fastify/helmet'
import { StatusCode } from "../../utils/statusCode"
import { Configuracao } from "../../main/configuracao"
import { IToken } from "../../domain/contratos/iToken"

export class FastifyAdapter extends HTTP {

  public app: FastifyInstance

  constructor(private token: IToken) {
    super()
    this.app = fastify()
    this.config()
  }

  on(url: string, metodo: "get" | "post" | "put" | "delete", fn: any) {
    this.app[metodo](url, async (req: any, reply: any) => {
      try {
        const output = await fn(req)
        return reply.code(StatusCode.OK).send(output)
      } catch (error) {
        return reply.code(StatusCode.SERVER_ERROR).send(error)
      }
    })
  }

  async listen(porta: number): Promise<void> {
    await this.app.listen({ port: porta })
    console.log(`[Auth Service] Servidor rodando na porta ${porta}`)
  }

  protected async authMiddleware(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    if (request.url.startsWith('/private')) {
      const token = request.headers['authorization']
      if (!token) {
        return reply.status(StatusCode.UNAUTHORIZED).send({ message: 'Token não fornecido' })
      }
      const isTokenValid = await this.token.verificar(token, Configuracao.token.chave as string)
      if (!isTokenValid) {
        return reply.status(StatusCode.UNAUTHORIZED).send({ message: 'Token inválido' })
      }
    }
    done()
  }

  //TODO: middleware para tratar erros mapeados (adicionar status code http de acordo com esses erros)

  private config(): void {
    this.app.register(helmet) // Middleware Helmet
    this.app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
      this.authMiddleware(request, reply, done)
    }) // Middleware de autenticação
  }
}
