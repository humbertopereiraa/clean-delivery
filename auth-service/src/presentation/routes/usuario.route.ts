import UsuarioService from "../../aplication/service/usuarioService"
import HTTP from "../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter from "../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../infra/database/postgresAdapter"
import { UsuarioRepository } from "../../infra/repositories/usuarioRepository"
import ZodValidatorAdapter from "../../infra/validators/zodValidatorAdapter"
import { UsuarioController } from "../controllers/usuarioController"
import { atualizarUsuarioSchema } from "../schemas/atualizarUsuario.schema"
import { deletarUsuarioSchema } from "../schemas/deletarUsuario.schema"
import { inserirUsuarioSchema } from "../schemas/inserirUsuario.schema"

const conexao = PostgresAdapter.getInstance()
const usuarioRepository = new UsuarioRepository(conexao)
const encrypter = new EncrypterBcryptAdapter()
const zodValidatorAdapter = new ZodValidatorAdapter()
const usuarioService = new UsuarioService(usuarioRepository, encrypter, zodValidatorAdapter)
const usuarioController = new UsuarioController(usuarioService)

export = (servidor: HTTP) => {
  servidor.on('/usuario', 'post', usuarioController.inserir.bind(usuarioController), inserirUsuarioSchema)
  servidor.on('/usuario', 'put', usuarioController.atualizar.bind(usuarioController), atualizarUsuarioSchema)
  servidor.on('/usuario/:id', 'delete', usuarioController.deletar.bind(usuarioController), deletarUsuarioSchema)
}
