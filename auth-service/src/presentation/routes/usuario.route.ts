import UsuarioService from "../../aplication/service/usuarioService"
import HTTP from "../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter from "../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../infra/database/postgresAdapter"
import WinstonLoggerAdapter from "../../infra/log/winstonLoggerAdapter"
import { UsuarioRepository } from "../../infra/repositories/usuarioRepository"
import { uuid } from "../../infra/token/uuid"
import ZodValidatorAdapter from "../../infra/validators/zodValidatorAdapter"
import { UsuarioController } from "../controllers/usuarioController"
import { atualizarUsuarioSchema } from "../schemas/atualizarUsuario.schema"
import { deletarUsuarioSchema } from "../schemas/deletarUsuario.schema"
import { inserirUsuarioSchema } from "../schemas/inserirUsuario.schema"

const conexao = PostgresAdapter.getInstance()
const logger = new WinstonLoggerAdapter()
const usuarioRepository = new UsuarioRepository(conexao, logger)
const encrypter = new EncrypterBcryptAdapter()
const zodValidatorAdapter = new ZodValidatorAdapter()
const usuarioService = new UsuarioService(usuarioRepository, encrypter, zodValidatorAdapter, uuid)
const usuarioController = new UsuarioController(usuarioService, logger)

export = (servidor: HTTP) => {
  servidor.on('/usuario', 'post', usuarioController.inserir.bind(usuarioController), inserirUsuarioSchema)
  servidor.on('/usuario', 'put', usuarioController.atualizar.bind(usuarioController), atualizarUsuarioSchema)
  servidor.on('/usuario/:id', 'delete', usuarioController.deletar.bind(usuarioController), deletarUsuarioSchema)
}
