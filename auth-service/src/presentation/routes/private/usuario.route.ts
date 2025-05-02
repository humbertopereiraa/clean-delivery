import InserirUsuario from "../../../aplication/usecases/inserirUsuario"
import HTTP from "../../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter  from "../../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../../infra/database/postgresAdapter"
import { UsuarioRepository } from "../../../infra/repositories/usuarioRepository"
import ZodValidatorAdapter from "../../../infra/validators/zodValidatorAdapter"
import { UsuarioController } from "../../controllers/usuarioController"

const conexao = PostgresAdapter.getInstance()
const usuarioRepository = new UsuarioRepository(conexao)
const encrypter = new EncrypterBcryptAdapter()
const zodValidatorAdapter = new ZodValidatorAdapter()
const inserirUsuarioUseCase = new InserirUsuario(usuarioRepository, encrypter, zodValidatorAdapter)
const usuarioController = new UsuarioController(inserirUsuarioUseCase)

export = (servidor: HTTP) => {
  servidor.on('/usuario', 'post', usuarioController.inserir.bind(usuarioController))
}
