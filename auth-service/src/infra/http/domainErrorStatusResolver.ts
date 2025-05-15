import { IDomainErrorStatusResolver } from "../../domain/contratos/iDomainErrorStatusResolver"
import { ErrorDomain } from "../../shared/constants"
import { StatusCode } from "../../utils/statusCode"

export class DomainErrorStatusResolver implements IDomainErrorStatusResolver {

  private mapStatusCode: Record<string, number> = {
    [ErrorDomain.E_CPF_INVALIDO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_NOME_OBRIGATORIO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_ROLE_INVALID]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_EMAIL_INVALIDO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_EMAIL_MAX_CARACTERES]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_NOME_MAX_CARACTERES]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_AUTENTICACAO_INVALIDA]: StatusCode.UNAUTHORIZED
  }

  public getStatusCodeHttp(code: string): number {
    return this.mapStatusCode[code] ?? StatusCode.BAD_REQUEST
  }
}
