import { IRouteDocumentation } from "./iRouteDocumentation"

export interface IRouteDocumentationEngine<App = any, Doc = IRouteDocumentation> {
  registrar(app: App, documentacao: Doc): Promise<void>
}
