import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import { IConexao } from "../../domain/contratos/iConexao"
import { ITransacao } from "../../domain/contratos/iTransacao"

export default class UnitOfWork implements IUnitOfWork {

  private trx?: ITransacao

  constructor(private conexao: IConexao) { }

  public async start(): Promise<void> {
    this.trx = await this.conexao.transaction()
  }

  public async commit(): Promise<void> {
    this.verificarTransacao()
    await this.trx?.commit()
    this.limparTransacao()
  }

  public async rollback(): Promise<void> {
    this.verificarTransacao()
    await this.trx?.rollback()
    this.limparTransacao()
  }

  public getConnection(): ITransacao {
    if (!this.trx) throw new Error("Transação não iniciada. Chame unitOfWork.start() primeiro.")
    return this.trx
  }

  private verificarTransacao(): void {
    if (!this.trx) throw new Error("Nenhuma transação ativa.")
  }

  private limparTransacao(): void {
    this.trx = undefined
  }
}
