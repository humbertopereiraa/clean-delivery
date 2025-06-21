import path from "path"
import fs from 'fs/promises'
import { IRouteDocumentationSchema } from "../contratos/iRouteDocumentationSchema"
import { IRouteDocumentationEngine } from "../contratos/iRouteDocumentationEngine"
import { IRouteDocumentation } from "../contratos/iRouteDocumentation"
import { IDomainErrorStatusResolver } from "../contratos/iDomainErrorStatusResolver"

export default abstract class HttpServer {

  constructor(protected domainErrorStatusResolver: IDomainErrorStatusResolver) { }

  abstract on(url: string, metodo: string, fn: (req: any) => any, routeDocumentationSchema?: IRouteDocumentationSchema): any
  abstract listen(porta: number): void
  abstract configurarDocumentacaoRotas(routeDocumentationEngine: IRouteDocumentationEngine, routeDocumentantion: IRouteDocumentation): void

  async carregarRotas(servidor: HttpServer): Promise<void> {
    const diretorio = path.join(__dirname, '../../', 'presentation', 'routes')
    try {
      const arquivos = await fs.readdir(diretorio)
      for (const arquivo of arquivos) {
        const caminho = path.join(diretorio, arquivo)
        const stats = await fs.stat(caminho)

        if (stats.isDirectory()) {
          const subArquivos = await fs.readdir(caminho)
          for (const arquivo1 of subArquivos) {
            const caminhoDoArquivo = path.join(caminho, arquivo1)
            await this.addServidorEmRotas(caminhoDoArquivo, arquivo1, servidor)
          }
        } else {
          await this.addServidorEmRotas(caminho, arquivo, servidor)
        }
      }
    } catch (error) {
      console.error(`Erro ao carregar rotas: ${error}`)
    }
  }

  /**Método para registra as rotas no servidor */
  private async addServidorEmRotas(caminhoDoArquivo: string, arquivo: string, servidor: HttpServer): Promise<void> {
    try {
      const rotaModulo = await import(caminhoDoArquivo)
      if (typeof rotaModulo.default !== 'function') {
        console.error(`O arquivo ${arquivo} não exporta uma função válida.`)
        return
      }
      await rotaModulo.default(servidor)
    } catch (error) {
      console.error(`Erro ao carregar o arquivo ${arquivo}:`, error)
    }
  }
}
