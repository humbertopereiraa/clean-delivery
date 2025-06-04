import { IRouteDocumentation } from "../../domain/contratos/iRouteDocumentation"

export default class SwaggerDocumentation implements IRouteDocumentation {

  public getTitulo(): string {
    return 'Pedido-Service'
  }

  public getVersao(): string {
    return '1.0.0'
  }

  public getDescricao(): string {
    return 'Documentação da API de Pedido'
  }
}