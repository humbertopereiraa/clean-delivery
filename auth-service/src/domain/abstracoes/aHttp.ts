import path from "path"
import fs from 'fs'
import { IRouteDocumentationSchema } from "../contratos/iRouteDocumentationSchema"
import { IRouteDocumentationEngine } from "../contratos/iRouteDocumentationEngine"
import { IRouteDocumentation } from "../contratos/iRouteDocumentation"

export default abstract class HttpServer {

  abstract on(url: string, metodo: string, fn: (req: any) => any, routeDocumentationSchema?: IRouteDocumentationSchema): any
  abstract listen(porta: number): void
  abstract configuraDocumentacaoRotas(routeDocumentationEngine: IRouteDocumentationEngine, routeDocumentantion: IRouteDocumentation): void

  carregarRotas(servidor: HttpServer): void {
    const diretorio = path.join(__dirname, '../../', 'presentation', 'routes')

    if (!fs.existsSync(diretorio)) {
      console.error(`Diretório de rotas não encontrado: ${diretorio}`)
      return
    }

    fs.readdirSync(diretorio).forEach((arquivo) => { // Lê todos os arquivos do diretório de rotas
      const caminho = path.join(diretorio, arquivo)
      const pasta = fs.statSync(caminho).isDirectory()
      if (pasta) { // Se for um diretório, percorre o conteúdo do diretório
        fs.readdirSync(caminho).forEach((arquivo1) => {
          const caminhoDoArquivo = path.join(diretorio, arquivo, arquivo1)
          this.addServidorEmRotas(caminhoDoArquivo, arquivo1, servidor)
        })
      } else {    // Se for um arquivo, registra a rota
        this.addServidorEmRotas(caminho, arquivo, servidor)
      }
    })
  }

  /**Método para registra as rotas no servidor */
  private async addServidorEmRotas(caminhoDoArquivo: string, arquivo: string, servidor: HttpServer): Promise<void> {
    try {
      const rotaModulo = await import(caminhoDoArquivo)
      if (typeof rotaModulo.default !== 'function') {
        console.error(`O arquivo ${arquivo} não exporta uma função válida.`)
        return
      }
      rotaModulo.default(servidor)
    } catch (error) {
      console.error(`Erro ao carregar o arquivo ${arquivo}:`, error)
    }
  }
}
