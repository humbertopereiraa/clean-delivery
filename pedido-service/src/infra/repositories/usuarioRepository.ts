import { ICache } from "../../domain/contratos/iCache"
import { ILogger } from "../../domain/contratos/iLogger"
import { IUsuarioHttpService } from "../../domain/contratos/iUsuarioHttpService"
import { Usuario } from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export default class UsuarioRepository implements IUsuarioRepository {

  private readonly chavePrefixo = 'usuario:'

  constructor(private readonly redis: ICache, private logger: ILogger, private readonly httpService: IUsuarioHttpService) { }

  public async salvar(usuario: Usuario): Promise<void> {
    try {
      await this.redis.salvar(`${this.chavePrefixo}${usuario.id}`, usuario)
    } catch (error) {
      this.logger.error('Erro ao salvar usuário', error)
      throw error
    }
  }

  public async obterPorId(id: string): Promise<Usuario | null> {
    try {
      let usuario = await this.redis.obter<Usuario>(`${this.chavePrefixo}${id}`)
      if (!usuario) {
        usuario = await this.buscarViaFallback(id)
      }
      return usuario
    } catch (error) {
      this.logger.error(`Erro ao obter usuário por id: ${id}`, error)
      throw error
    }
  }

  public async atualizar(usuario: Usuario): Promise<void> {
    try {
      await this.salvar(usuario)
    } catch (error) {
      this.logger.error('Erro ao atualizar usuário.', error)
      throw error
    }
  }

  public async deletar(id: string): Promise<void> {
    try {
      await this.redis.deletar(`${this.chavePrefixo}${id}`)
    } catch (error) {
      this.logger.error(`Erro ao deletar usuário com id: ${id}`, error)
      throw error
    }
  }

  private async buscarViaFallback(id: string): Promise<Usuario | null> {
    const usuario = await this.httpService.buscarUsuarioPorId(id)
    if (!usuario) return null

    const usuarioEntidade = new Usuario(usuario.id, usuario.nome, usuario.email, usuario.role)
    await this.salvar(usuarioEntidade)
    return usuarioEntidade
  }
}
