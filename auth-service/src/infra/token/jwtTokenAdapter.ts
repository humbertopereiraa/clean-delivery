import jwt from "jsonwebtoken"
import { IToken } from "../../domain/contratos/iToken"

export class JwtTokenAdapter implements IToken {
  gerar(payload: any, chavePrivada: string, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, chavePrivada, options, (erro, token) => {
        erro ? reject(erro) : resolve(token as string)
      })
    })
  }

  verificar(token: string, chavePrivada: string): Promise<boolean> {
    return new Promise((resolve) => {
      const newToken = token.replace('Bearer', '').replace(/\s/g, '')
      try {
        const decoded = jwt.verify(newToken, chavePrivada) as any
        resolve(decoded ? true : false)
      } catch (error) {
        resolve(false)
      }
    })
  }
}