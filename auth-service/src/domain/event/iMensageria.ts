import { IEvento, ETipoEvento } from "./iEvento"

export interface IMensageria {
  conectar(): Promise<void>
  publicar(tipoEvento: ETipoEvento, evento: IEvento): Promise<boolean>
  fechar(): Promise<void>
}
