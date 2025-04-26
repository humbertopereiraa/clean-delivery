import path from "path"
import fs from 'fs'

export default abstract class HTTP {

  abstract on(url: string, metodo: string, fn: any): any
  abstract listen(porta: number): void
  protected abstract authMiddleware(...params: any[]): any

  carregarRotas(servidor: HTTP): void {
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
  private addServidorEmRotas(caminhoDoArquivo: string, arquivo: string, servidor: HTTP): void {
    const includeFn = require(caminhoDoArquivo)
    if (typeof includeFn !== 'function') {
      console.error(`O arquivo ${arquivo} não exporta uma função válida.`)
      return
    }
    includeFn(servidor)
  }
}
