import { IEvento, ETipoEvento } from "./iEvento"

export interface IMensageria {
  conectar(maxRetries: number): Promise<void>
  publicar(tipoEvento: ETipoEvento, evento: IEvento): Promise<boolean>
  fechar(): Promise<void>
}
