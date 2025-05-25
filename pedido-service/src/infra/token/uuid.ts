import { IUuid } from "../../domain/contratos/iUuid"
import { v4 as uuidv4 } from 'uuid'

class Uuid implements IUuid {
  gerar(): string {
    return uuidv4()
  }
}

export const uuid = new Uuid()