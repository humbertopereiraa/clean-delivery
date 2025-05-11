import Autenticar from "../../aplication/usecases/autenticar"
import HTTP from "../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter from "../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../infra/database/postgresAdapter"
import { UsuarioRepository } from "../../infra/repositories/usuarioRepository"
import { JwtTokenAdapter } from "../../infra/token/jwtTokenAdapter"
import ZodValidatorAdapter from "../../infra/validators/zodValidatorAdapter"
import { Configuracao } from "../../main/configuracao"
import { AuthController } from "../controllers/authController"

const conexao = PostgresAdapter.getInstance()
const usuarioRepository = new UsuarioRepository(conexao)
const encrypter = new EncrypterBcryptAdapter()
const token = new JwtTokenAdapter()
const zodValidatorAdapter = new ZodValidatorAdapter()
const autenticar = new Autenticar(usuarioRepository, encrypter, token, Configuracao.token.chave, zodValidatorAdapter)
const authController = new AuthController(autenticar)

export = (servidor: HTTP) => {
  servidor.on('/login', 'post', authController.autenticacao.bind(authController))
}