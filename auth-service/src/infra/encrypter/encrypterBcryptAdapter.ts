import bcrypt from "bcrypt"
import { Configuracao } from "../../main/configuracao"
import { IEncrypter } from "../../domain/contratos/iEncrypter"

const saltRounds = Configuracao.hash

export class EncrypterBcryptAdapter implements IEncrypter {
  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, saltRounds)
  }

  async comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, encryptedPassword)
    return match
  }
}