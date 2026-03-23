import { Observable } from "rxjs"
import { IEvento } from "./iPayload"

export interface IMensageria {
  conectar(maxRetries?: number): Promise<void>
  escutarEventos(): Observable<IEvento>
  fechar(): Promise<void>
}
