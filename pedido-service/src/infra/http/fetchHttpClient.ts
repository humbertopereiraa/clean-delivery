import { IHttpClient } from "../../domain/contratos/iHttpClient"

export default class FetchHttpClient implements IHttpClient {

  public async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Erro na requisição HTTP: ${response.status}`)
    return response.json()
  }
}
