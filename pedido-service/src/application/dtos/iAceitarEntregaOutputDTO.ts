import { EntregaStatus } from "../../domain/entities/entrega"

export interface IAceitarEntregaOutputDTO {
  id: string
  pedidoId: string
  entregadorId: string
  status: EntregaStatus
  aceitaEm: Date
}
