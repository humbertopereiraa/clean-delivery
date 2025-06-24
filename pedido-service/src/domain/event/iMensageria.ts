import { Observable } from "rxjs"
import { IEvento } from "./iPayload"

export interface IMensageria {
  conectar(): Promise<void>
  escutarEventos(): Observable<IEvento>
  fechar(): Promise<void>
}
