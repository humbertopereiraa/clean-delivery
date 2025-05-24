import { IConexao } from "../../domain/contratos/iConexao"
import { ILogger } from "../../domain/contratos/iLogger"
import Usuario from "../../domain/entities/usuario"
import { IUsuarioRepository } from "../../domain/repositories/iUsuarioRepository"

export class UsuarioRepository implements IUsuarioRepository {

  constructor(private conexao: IConexao, private logger: ILogger) { }

  public async buscarPorId(id: string): Promise<Usuario | undefined> {
    try {
      const sql = `SELECT * FROM usuarios WHERE id = $1`
      const { rows } = await this.conexao.query(sql, [id])
      if (rows.length === 0) return undefined
      const usuario = rows[0]
      return new Usuario(usuario.id, usuario.nome, usuario.email, usuario.senha, usuario.cpf, usuario.role, usuario.criado_em, usuario.atualizado_em)
    } catch (error: any) {
      this.logger.error("Erro ao buscar usuário por ID:", error?.stack)
      throw error
    }
  }

  public async buscarPorEmail(email: string): Promise<Usuario | undefined> {
    try {
      const sql = `SELECT * FROM usuarios WHERE email = $1`
      const { rows } = await this.conexao.query(sql, [email])
      if (rows.length === 0) return undefined
      const usuario = rows[0]
      return new Usuario(usuario.id, usuario.nome, usuario.email, usuario.senha, usuario.cpf, usuario.role, usuario.criado_em, usuario.atualizado_em)
    } catch (error: any) {
      this.logger.error("Erro ao buscar usuário por Email", error?.stack)
      throw error
    }
  }

  public async inserir(usuario: Usuario): Promise<Usuario> {
    try {
      const { id, nome, email, senha, cpf, role, criadoEm } = usuario
      const sql = 'INSERT INTO usuarios (id, nome, email, senha, cpf, role, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
      const output = await this.conexao.query(sql, [id, nome, email.value, senha, cpf.value, role, criadoEm])
      const usuarioInserido = output?.rows[0]

      return new Usuario(usuarioInserido.id, usuarioInserido.nome, usuarioInserido.email, usuarioInserido.senha, usuarioInserido.cpf, usuarioInserido.role, usuarioInserido.criado_em, usuarioInserido.atualizado_em)
    } catch (error: any) {
      this.logger.error("Erro ao inserir usuário", error?.stack)
      throw error
    }
  }

  public async atualizar(usuario: Usuario): Promise<Usuario> {
    try {
      const { id, nome, email, senha, cpf, role } = usuario
      const sql = `UPDATE usuarios SET nome = $1,email = $2,senha = $3,cpf = $4,role = $5,atualizado_em = NOW() WHERE id = $6 RETURNING *`
      const output = await this.conexao.query(sql, [nome, email.value, senha, cpf.value, role, id])
      if (output.rows.length === 0) {
        throw new Error("Usuário não encontrado para atualização.")
      }
      const atualizado = output.rows[0]
      return new Usuario(
        atualizado.id,
        atualizado.nome,
        atualizado.email,
        atualizado.senha,
        atualizado.cpf,
        atualizado.role,
        atualizado.criado_em,
        atualizado.atualizado_em
      )
    } catch (error: any) {
      this.logger.error("Erro ao atualizar usuário", error?.stack)
      throw error
    }
  }

  public deletar(id: string): Promise<void> {
    try {
      const sql = 'DELETE FROM usuarios WHERE id = $1'
      return this.conexao.query(sql, [id])
    } catch (error: any) {
      this.logger.error("Erro ao deletar usuário", error?.stack)
      throw error
    }
  }
}
