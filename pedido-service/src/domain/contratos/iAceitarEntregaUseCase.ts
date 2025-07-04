import { IAceitarEntregaInputDTO } from "../../application/dtos/iAceitarEntregaInputDTO"
import { IAceitarEntregaOutputDTO } from "../../application/dtos/iAceitarEntregaOutputDTO"

export interface IAceitarEntregaUseCase {
  execute(input: IAceitarEntregaInputDTO): Promise<IAceitarEntregaOutputDTO>
}
