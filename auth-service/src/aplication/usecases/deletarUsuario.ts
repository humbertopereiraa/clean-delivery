import { IDeletarUsuario } from "../../domain/contratos/iDeletarUsuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export class DeletarUsuario implements IDeletarUsuario {

  constructor(private usuarioRepository: IUsuarioRepository) { }

  async execute(id: string): Promise<void> {
    const usuarioExistente = await this.usuarioRepository.buscarPorId(id)
    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado.")
    }
    await this.usuarioRepository.deletar(id)
  }
}
