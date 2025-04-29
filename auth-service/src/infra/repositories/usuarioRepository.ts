import { IConexao } from "../../domain/contratos/iConexao"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export class UsuarioRepository implements IUsuarioRepository {

  constructor(private conexao: IConexao) { }

  public async inserir(usuario: Usuario): Promise<Usuario> {
    try {
      const { id, nome, email, senha, cpf, role, criadoEm } = usuario
      const sql = 'INSERT INTO auth.users (id, nome, email, senha, cpf, role, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
      const output = await this.conexao.query(sql, [id, nome, email.value, senha, cpf.value, role, criadoEm])
      const usuarioInserido = output?.rows[0]

      return new Usuario(usuarioInserido.nome, usuarioInserido.email, usuarioInserido.senha, usuarioInserido.cpf, usuarioInserido.role, usuarioInserido.id, usuarioInserido.criadoEm)
    } catch (error) {
      console.error("Erro ao inserir usuário:", error) //TODO: adicionar Logger
      throw error
    }
  }
}
