import AuthService from "../../application/service/authService"
import HTTP from "../../domain/abstracoes/aHttp"
import EncrypterBcryptAdapter from "../../infra/crypto/encrypterBcryptAdapter"
import { PostgresAdapter } from "../../infra/database/postgresAdapter"
import WinstonLoggerAdapter from "../../infra/log/winstonLoggerAdapter"
import { UsuarioRepository } from "../../infra/repositories/usuarioRepository"
import { JwtTokenAdapter } from "../../infra/token/jwtTokenAdapter"
import ZodValidatorAdapter from "../../infra/validators/zodValidatorAdapter"
import { Configuracao } from "../../main/configuracao"
import { AuthController } from "../controllers/authController"
import { loginSchema } from "../schemas/login.schema"

const conexao = PostgresAdapter.getInstance()
const logger = new WinstonLoggerAdapter()
const usuarioRepository = new UsuarioRepository(conexao, logger)
const encrypter = new EncrypterBcryptAdapter()
const token = new JwtTokenAdapter()
const zodValidatorAdapter = new ZodValidatorAdapter()
const authService = new AuthService(usuarioRepository, encrypter, token, Configuracao.token.chave, zodValidatorAdapter)
const authController = new AuthController(authService, logger)

export = (servidor: HTTP) => {
  servidor.on('/login', 'post', authController.autenticacao.bind(authController), loginSchema)
}