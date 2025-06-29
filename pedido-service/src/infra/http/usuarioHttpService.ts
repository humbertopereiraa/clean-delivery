import { IHttpClient } from "../../domain/contratos/iHttpClient"
import { ILogger } from "../../domain/contratos/iLogger"
import { IUsuarioHttpService } from "../../domain/contratos/iUsuarioHttpService"
import { Usuario } from "../../domain/entities/usuario"
import { Configuracao } from "../../main/configuracao"

export default class UsuarioHttpService implements IUsuarioHttpService {

  private url = Configuracao.auth_service_url

  constructor(private httpClient: IHttpClient, private logger: ILogger) { }

  public async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    try {
      const usuario = await this.httpClient.get<Usuario>(`${this.url}/usuarios/auth-service/${id}`)
      return usuario ? new Usuario(usuario.id, usuario.nome, usuario.email, usuario.role) : null
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por ID: ${id}`, error)
      return null
    }
  }
}
