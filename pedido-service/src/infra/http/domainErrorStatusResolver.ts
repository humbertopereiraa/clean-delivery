import { IDomainErrorStatusResolver } from "../../domain/contratos/iDomainErrorStatusResolver"
import { ErrorDomain } from "../../shared/constants"
import { StatusCode } from "../../utils/statusCode"

export class DomainErrorStatusResolver implements IDomainErrorStatusResolver {

  private mapStatusCode: Record<string, number> = {
    [ErrorDomain.E_CEP_INVALIDO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_CAMPO_OBRIGATORIO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_TELEFONE_INVALIDO]: StatusCode.UNPROCESSABLE_ENTITY,
    [ErrorDomain.E_FORMATO_INVALIDO]: StatusCode.UNPROCESSABLE_ENTITY
  }

  public getStatusCodeHttp(code: string): number {
    return this.mapStatusCode[code] ?? StatusCode.BAD_REQUEST
  }
}
