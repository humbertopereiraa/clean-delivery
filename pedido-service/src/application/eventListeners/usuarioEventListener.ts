import { ILogger } from "../../domain/contratos/iLogger"
import { Usuario } from "../../domain/entities/usuario"
import { IMensageria } from "../../domain/event/iMensageria"
import { ETipoEvento, IEvento } from "../../domain/event/iPayload"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export default class UsuarioEventListener {

  constructor(private mensageria: IMensageria, private usuarioRepository: IUsuarioRepository, private readonly logger: ILogger) { }

  public async iniciar(): Promise<void> {
    await this.mensageria.conectar()
    this.mensageria.escutarEventos().subscribe({
      next: (evento: IEvento) => {
        const { tipo, payload: { id, nome, email, role } } = evento
        const usuario = new Usuario(id, nome, email, role)
        switch (tipo) {
          case ETipoEvento.USUARIO_CRIADO:
            this.usuarioRepository.salvar(usuario)
            break
          case ETipoEvento.USUARIO_ATUALIZADO:
            this.usuarioRepository.atualizar(usuario)
            break
          case ETipoEvento.USUARIO_DELETADO:
            this.usuarioRepository.deletar(usuario.id)
            break
          default:
            this.logger.warn(`UsuarioEventListener: Evento do tipo: ${tipo} não identificado.`)
        }
      },
      error: (erro: any) => {
        this.logger.error('Erro ao escutar eventos de Mensageria', erro)
      },
    })
  }
}
