import { IConexao } from "../../domain/contratos/iConexao"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export class UsuarioRepository implements IUsuarioRepository {

  constructor(private conexao: IConexao) { }

  public async buscarPorId(id: string): Promise<Usuario | undefined> {
    try {
      const sql = `SELECT * FROM auth.users WHERE id = $1`
      const { rows } = await this.conexao.query(sql, [id])
      if (rows.length === 0) return undefined
      const usuario = rows[0]
      return new Usuario(usuario.nome, usuario.email, usuario.senha, usuario.cpf, usuario.role, usuario.id, usuario.criadoEm)
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error) //TODO: adicionar Logger
      throw error
    }
  }

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

  public async atualizar(usuario: Usuario): Promise<Usuario> {
    try {
      const { id, nome, email, senha, cpf, role } = usuario
      const sql = `UPDATE auth.users SET nome = $1,email = $2,senha = $3,cpf = $4,role = $5,atualizado_em = NOW() WHERE id = $6 RETURNING *`
      const output = await this.conexao.query(sql, [nome, email.value, senha, cpf.value, role, id])
      if (output.rows.length === 0) {
        throw new Error("Usuário não encontrado para atualização.")
      }
      const atualizado = output.rows[0]
      return new Usuario(
        atualizado.nome,
        atualizado.email,
        atualizado.senha,
        atualizado.cpf,
        atualizado.role,
        atualizado.id,
        atualizado.criadoEm,
        atualizado.atualizado_em
      )
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error) // TODO: adicionar Logger
      throw error
    }
  }

  public deletar(id: string): Promise<void> {
    try {
      const sql = 'DELETE FROM auth.users WHERE id = $1'
      return this.conexao.query(sql, [id])
    } catch (error) {
      console.error("Erro ao deletar usuário:", error) // TODO: adicionar Logger
      throw error
    }
  }
}
