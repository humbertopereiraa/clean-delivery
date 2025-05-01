import { InserirUsuario } from "../../../aplication/usecases/inserirUsuario"
import HTTP from "../../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter  from "../../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../../infra/database/postgresAdapter"
import { UsuarioRepository } from "../../../infra/repositories/usuarioRepository"
import { UsuarioController } from "../../controllers/usuarioController"

const conexao = PostgresAdapter.getInstance()
const usuarioRepository = new UsuarioRepository(conexao)
const encrypter = new EncrypterBcryptAdapter()
const inserirUsuarioUseCase = new InserirUsuario(usuarioRepository, encrypter)
const usuarioController = new UsuarioController(inserirUsuarioUseCase)

export = (servidor: HTTP) => {
  servidor.on('/usuario', 'post', usuarioController.inserir.bind(usuarioController))
}
