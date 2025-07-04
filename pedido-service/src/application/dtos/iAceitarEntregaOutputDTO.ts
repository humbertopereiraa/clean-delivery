import { NEntrega } from "../../domain/entities/entrega"

export interface IAceitarEntregaOutputDTO {
  id: string
  pedidoId: string
  entregadorId: string
  status: NEntrega.status
  aceitaEm: Date
}
